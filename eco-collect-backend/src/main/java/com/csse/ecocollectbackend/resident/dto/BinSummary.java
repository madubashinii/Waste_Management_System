package com.csse.ecocollectbackend.resident.dto;

public class BinSummary {

    private Integer plasticCount;
    private Integer organicCount;
    private Integer generalCount;

    // Constructor
    public BinSummary(Integer plasticCount, Integer organicCount, Integer generalCount) {
        this.plasticCount = plasticCount;
        this.organicCount = organicCount;
        this.generalCount = generalCount;
    }

    // Getters & setters
    public Integer getPlasticCount() { return plasticCount; }
    public void setPlasticCount(Integer plasticCount) { this.plasticCount = plasticCount; }

    public Integer getOrganicCount() { return organicCount; }
    public void setOrganicCount(Integer organicCount) { this.organicCount = organicCount; }

    public Integer getGeneralCount() { return generalCount; }
    public void setGeneralCount(Integer generalCount) { this.generalCount = generalCount; }
}
