package com.csse.ecocollectbackend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from backend!";
    }
    
    @PostMapping("/echo")
    public String echo(@RequestBody String message) {
        return "Echo: " + message;
    }
}
