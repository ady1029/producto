package cu.aica.product_resource.api.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RequiredCountDTO {

    private Double requiredCount;
    private String resourceFamilyBaseName;
    private BigDecimal consumptionIndex;

}
