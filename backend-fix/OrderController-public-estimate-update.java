// Update to OrderController public estimate endpoint to handle includeTrailer parameter

@PostMapping("/public/estimate")
public ResponseEntity<?> getPublicEstimate(@RequestBody Map<String, Object> estimateRequest) {
    try {
        // Extract parameters
        String pickupAddress = (String) estimateRequest.get("pickupAddress");
        String deliveryAddress = (String) estimateRequest.get("deliveryAddress");
        Object weightObj = estimateRequest.get("weight");
        String serviceType = (String) estimateRequest.get("serviceType");
        Boolean includeTrailer = (Boolean) estimateRequest.getOrDefault("includeTrailer", false);
        
        // Validation
        if (pickupAddress == null || deliveryAddress == null || serviceType == null) {
            return ResponseEntity.badRequest()
                .body(Collections.singletonMap("error", "Missing required fields: pickupAddress, deliveryAddress, serviceType"));
        }

        // Convert weight
        double weight = 1.0; // default
        if (weightObj != null) {
            if (weightObj instanceof Number) {
                weight = ((Number) weightObj).doubleValue();
            } else if (weightObj instanceof String) {
                try {
                    weight = Double.parseDouble((String) weightObj);
                } catch (NumberFormatException e) {
                    weight = 1.0;
                }
            }
        }

        // Convert service type to match backend enum format
        String backendServiceType = serviceType.toUpperCase().replace("-", "_");
        
        // Calculate distance and price including trailer option
        DistanceResponse response = googleMapsService.calculateDistanceAndPrice(
            pickupAddress, 
            deliveryAddress, 
            weight, 
            backendServiceType,
            includeTrailer != null ? includeTrailer : false
        );

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        logger.error("Error calculating public estimate: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Collections.singletonMap("error", "Failed to calculate estimate: " + e.getMessage()));
    }
}