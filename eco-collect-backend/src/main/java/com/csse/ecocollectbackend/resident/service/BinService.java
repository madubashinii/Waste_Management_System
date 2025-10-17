package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.resident.dto.BinSummary;
import com.csse.ecocollectbackend.resident.entity.Bin;

import java.util.List;

public interface BinService {
    BinSummary getSummaryByUserId(Integer userId);
    Bin registerBin(Bin bin, User resident);
    List<Bin> getBinsByResident(User resident);
}
