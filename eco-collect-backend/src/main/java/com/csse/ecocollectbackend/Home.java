package com.csse.ecocollectbackend;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Home {

        @GetMapping("/")
        public String home() {
            return "EcoCollect Backend is Running ✅";
        }

}
