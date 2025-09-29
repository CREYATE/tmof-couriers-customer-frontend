// Update your OrderController's getPublicEstimate method with this:

@PostMapping("/public/estimate")
public ResponseEntity<?> getPublicEstimate(@RequestBody Map<String, Object> estimateRequest) {
    try {
        // Extract parameters
        String pickupAddress = (String) estimateRequest.get("pickupAddress");
        String deliveryAddress = (String) estimateRequest.get("deliveryAddress");
        Object weightObj = estimateRequest.get("weight");
        String serviceType = (String) estimateRequest.get("serviceType");
        Boolean includeTrailer = (Boolean) estimateRequest.get("includeTrailer"); // This was missing or wrong
        
        // Debug logging
        logger.info("Received public estimate request: pickup={}, delivery={}, weight={}, serviceType={}, includeTrailer={}", 
                   pickupAddress, deliveryAddress, weightObj, serviceType, includeTrailer);
        
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

        // Ensure includeTrailer is not null
        boolean includeTrailerFlag = includeTrailer != null && includeTrailer;
        
        // Calculate distance and price including trailer option
        DistanceResponse response = googleMapsService.calculateDistanceAndPrice(
            pickupAddress, 
            deliveryAddress, 
            weight, 
            serviceType,
            includeTrailerFlag  // Make sure this parameter is passed correctly
        );

        logger.info("Returning estimate response: {}", response);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        logger.error("Error calculating public estimate: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Collections.singletonMap("error", "Failed to calculate estimate: " + e.getMessage()));
    }
}