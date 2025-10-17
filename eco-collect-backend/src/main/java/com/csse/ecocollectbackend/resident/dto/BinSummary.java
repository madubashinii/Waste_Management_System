package com.csse.ecocollectbackend.resident.dto;

import java.util.List;

public class BinSummary {

    private int plasticCount;
    private int organicCount;
    private int generalCount;

    private List<Integer> plasticBinIds;
    private List<Integer> organicBinIds;
    private List<Integer> generalBinIds;

    public BinSummary(int plasticCount, int organicCount, int generalCount,
                      List<Integer> plasticBinIds, List<Integer> organicBinIds, List<Integer> generalBinIds) {
        this.plasticCount = plasticCount;
        this.organicCount = organicCount;
        this.generalCount = generalCount;
        this.plasticBinIds = plasticBinIds;
        this.organicBinIds = organicBinIds;
        this.generalBinIds = generalBinIds;
    }


    // Getters & setters
    public Integer getPlasticCount() { return plasticCount; }
    public void setPlasticCount(Integer plasticCount) { this.plasticCount = plasticCount; }

    public Integer getOrganicCount() { return organicCount; }
    public void setOrganicCount(Integer organicCount) { this.organicCount = organicCount; }

    public Integer getGeneralCount() { return generalCount; }
    public void setGeneralCount(Integer generalCount) { this.generalCount = generalCount; }
}
