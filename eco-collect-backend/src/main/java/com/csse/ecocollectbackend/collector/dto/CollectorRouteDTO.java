
package com.csse.ecocollectbackend.collector.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectorRouteDTO {
    private Integer routeId;
    private String routeName;
    private String zoneName;
    private String status;
    private String collectionDate;
    private List<CollectorRouteStopDTO> stops;
}

