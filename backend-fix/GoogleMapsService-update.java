package com.tmof_couriers.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmof_couriers.dtos.DistanceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class GoogleMapsService {
    private static final Logger logger = LoggerFactory.getLogger(GoogleMapsService.class);

    @Value("${google.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public GoogleMapsService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public DistanceResponse calculateDistanceAndPrice(String origin, String destination, double weight, String serviceType, boolean includeTrailer) {
        logger.info("Calculating distance from {} to {} with serviceType {} and trailer: {}", origin, destination, serviceType, includeTrailer);
        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/directions/json?origin=%s&destination=%s&key=%s",
                    origin.replace(" ", "+"), destination.replace(" ", "+"), apiKey
            );
            String responseStr = restTemplate.getForObject(url, String.class);
            if (responseStr == null) {
                throw new Exception("Empty response from Google Directions API");
            }

            JsonNode root = objectMapper.readTree(responseStr);
            String status = root.path("status").asText();
            if (!"OK".equals(status)) {
                String errorMessage = root.path("error_message").asText("Unknown error");
                throw new Exception("Directions API error: " + status + " - " + errorMessage);
            }

            JsonNode routes = root.path("routes");
            if (routes.isEmpty()) {
                throw new Exception("No routes found between origin and destination");
            }

            double distanceMeters = routes.get(0).path("legs").get(0).path("distance").path("value").asDouble(0);
            if (distanceMeters == 0) {
                throw new Exception("Invalid distance returned (0 meters)");
            }
            double distanceKm = distanceMeters / 1000.0;

            double basePrice;
            double pricePerKm;
            double weightFactor = weight > 5 ? 1.2 : 1.0;

            switch (serviceType) {
                case "SAME_DAY":
                    basePrice = 80.0; // Same-Day Delivery base fare
                    pricePerKm = 4.0; // Same-Day Delivery price per km
                    break;
                case "INSTANT_DELIVERY":
                    basePrice = 100.0; // Instant Delivery base fare
                    pricePerKm = 7.0; // Instant Delivery price per km
                    break;
                case "STANDARD_DELIVERY":
                    basePrice = 110.0; // Standard Delivery base fare
                    pricePerKm = 5.0; // Default price per km (not specified in policy)
                    break;
                case "FURNITURE_MOVING":
                    basePrice = 450.0; // Movers Service base fare
                    pricePerKm = 25.0; // Movers Service price per km
                    break;
                case "SWIFT_ERRAND":
                    basePrice = 150.0; // Swift Errand minimum service fee
                    pricePerKm = 7.0; // Swift Errand uses Instant Delivery km rate
                    break;
                default:
                    basePrice = 50.0; // Fallback default
                    pricePerKm = 5.0; // Fallback default
                    break;
            }

            BigDecimal baseFeeDecimal = BigDecimal.valueOf(basePrice).setScale(2, BigDecimal.ROUND_HALF_UP);
            
            // Calculate trailer fee
            BigDecimal trailerFee = BigDecimal.ZERO;
            if ("FURNITURE_MOVING".equals(serviceType) && includeTrailer) {
                trailerFee = BigDecimal.valueOf(450.0).setScale(2, BigDecimal.ROUND_HALF_UP);
            }
            
            BigDecimal totalPrice = BigDecimal.valueOf(basePrice + (distanceKm * pricePerKm * weightFactor))
                    .add(trailerFee)
                    .setScale(2, BigDecimal.ROUND_HALF_UP);
            
            logger.info("Calculated distance: {} km, base fee: {}, trailer fee: {}, total price: {}", distanceKm, baseFeeDecimal, trailerFee, totalPrice);
            return new DistanceResponse(distanceKm, totalPrice, baseFeeDecimal, trailerFee);
        } catch (Exception e) {
            logger.error("Failed to calculate distance from {} to {}: {}", origin, destination, e.getMessage(), e);
            return new DistanceResponse(0.0, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, "Failed to calculate distance: " + e.getMessage());
        }
    }

    public String geocodeAddress(String address) {
        logger.info("Geocoding address: {}", address);
        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s",
                    address.replace(" ", "+"), apiKey
            );
            String responseStr = restTemplate.getForObject(url, String.class);
            if (responseStr == null) {
                throw new Exception("Empty response from Google Geocode API");
            }

            JsonNode root = objectMapper.readTree(responseStr);
            String status = root.path("status").asText();
            if (!"OK".equals(status)) {
                String errorMessage = root.path("error_message").asText("Unknown error");
                throw new Exception("Geocode API error: " + status + " - " + errorMessage);
            }

            JsonNode results = root.path("results");
            if (results.isEmpty()) {
                throw new Exception("No geocoding results found for address");
            }

            JsonNode location = results.get(0).path("geometry").path("location");
            if (location.isMissingNode()) {
                throw new Exception("No location found in geocoding results");
            }

            String coordinates = location.path("lat").asText() + "," + location.path("lng").asText();
            logger.info("Geocoded address {} to coordinates: {}", address, coordinates);
            return coordinates;
        } catch (Exception e) {
            logger.error("Failed to geocode address {}: {}", address, e.getMessage(), e);
            return null;
        }
    }
}