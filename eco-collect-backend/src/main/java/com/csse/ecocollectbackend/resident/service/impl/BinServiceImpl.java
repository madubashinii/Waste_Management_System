package com.csse.ecocollectbackend.resident.service.impl;

import com.csse.ecocollectbackend.resident.dto.BinSummary;
import com.csse.ecocollectbackend.resident.entity.Bin;
import com.csse.ecocollectbackend.resident.repository.BinRepository;
import com.csse.ecocollectbackend.resident.service.BinService;
import com.csse.ecocollectbackend.login.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BinServiceImpl implements BinService {

    private final BinRepository binRepository;

    public BinServiceImpl(BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    @Override
    public BinSummary getSummaryByUserId(Integer userId) {
        User user = new User();
        user.setUserId(userId);

        List<Bin> bins = binRepository.findByResident(user);

        int plasticCount = 0;
        int organicCount = 0;
        int generalCount = 0;

        List<Integer> plasticBinIds = new ArrayList<>();
        List<Integer> organicBinIds = new ArrayList<>();
        List<Integer> generalBinIds = new ArrayList<>();

        for (Bin bin : bins) {
            switch (bin.getBinType()) {
                case Recyclable -> {
                    plasticCount++;
                    plasticBinIds.add(bin.getBinId());
                }
                case Organic -> {
                    organicCount++;
                    organicBinIds.add(bin.getBinId());
                }
                case General -> {
                    generalCount++;
                    generalBinIds.add(bin.getBinId());
                }
            }
        }

        return new BinSummary(plasticCount, organicCount, generalCount,
                plasticBinIds, organicBinIds, generalBinIds);
    }


    @Override
    public Bin registerBin(Bin bin, User resident) {
        bin.setResident(resident);
        bin.setStatus(Bin.BinStatus.Active);
        bin.setCreatedAt(LocalDateTime.now());
        return binRepository.save(bin);
    }

    @Override
    public List<Bin> getBinsByResident(User resident) {
        return binRepository.findByResident(resident);
    }
}

