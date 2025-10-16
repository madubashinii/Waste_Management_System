package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.BinSummary;
import com.csse.ecocollectbackend.resident.entity.Bin;
import com.csse.ecocollectbackend.resident.repository.BinRepository;
import com.csse.ecocollectbackend.resident.service.BinService;
import com.csse.ecocollectbackend.login.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BinServiceImpl implements BinService {

    private final BinRepository binRepository;

    public BinServiceImpl(BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    @Override
    public BinSummary getSummaryByUserId(Integer userId) {
        // Fetch bins belonging to the user
        User user = new User();
        user.setUserId(userId);

        List<Bin> bins = binRepository.findByResident(user);

        int plasticCount = 0;
        int organicCount = 0;
        int generalCount = 0;

        for (Bin bin : bins) {
            switch (bin.getBinType()) {
                case Recyclable -> plasticCount++;
                case Organic -> organicCount++;
                case General -> generalCount++;
            }
        }

        return new BinSummary(plasticCount, organicCount, generalCount);
    }
}

