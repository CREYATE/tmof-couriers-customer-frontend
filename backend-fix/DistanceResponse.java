package com.tmof_couriers.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DistanceResponse {
    private Double distanceKm;
    private BigDecimal price; // Total price
    private BigDecimal baseFee; // Base fee component
    private BigDecimal trailerFee; // Trailer fee component
    private String error;

    public DistanceResponse() {}

    public DistanceResponse(double distanceKm, BigDecimal price) {
        this.distanceKm = distanceKm;
        this.price = price;
    }

    public DistanceResponse(double distanceKm, BigDecimal price, BigDecimal baseFee) {
        this.distanceKm = distanceKm;
        this.price = price;
        this.baseFee = baseFee;
    }

    public DistanceResponse(double distanceKm, BigDecimal price, BigDecimal baseFee, BigDecimal trailerFee) {
        this.distanceKm = distanceKm;
        this.price = price;
        this.baseFee = baseFee;
        this.trailerFee = trailerFee;
    }

    public DistanceResponse(double distanceKm, BigDecimal price, BigDecimal baseFee, BigDecimal trailerFee, String error) {
        this.distanceKm = distanceKm;
        this.price = price;
        this.baseFee = baseFee;
        this.trailerFee = trailerFee;
        this.error = error;
    }

    public DistanceResponse(double distanceKm, BigDecimal price, String error) {
        this.distanceKm = distanceKm;
        this.price = price;
        this.error = error;
    }
}