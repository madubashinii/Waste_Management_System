package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.BinSummary;
import com.csse.ecocollectbackend.resident.entity.Bin;

public interface BinService {
    BinSummary getSummaryByUserId(Integer userId);
}
