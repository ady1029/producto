package cu.aica.product_resource.api.dto.report;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class MistralCountTotalDTO {

    private List<ResourceDTO> resourceList;
    private List<NationalDemandResourceDTO> nationalDemandResourceList;
    private Double mistralTotalCount;
}
