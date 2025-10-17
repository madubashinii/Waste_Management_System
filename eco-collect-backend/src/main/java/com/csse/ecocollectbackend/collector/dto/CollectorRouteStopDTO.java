
package com.csse.ecocollectbackend.collector.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectorRouteStopDTO {
    private Integer stopId;
    private String binId;
    private Integer stopOrder;
    private Boolean collected;
    private String location;
}

