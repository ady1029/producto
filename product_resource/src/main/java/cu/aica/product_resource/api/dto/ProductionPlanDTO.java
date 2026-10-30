package cu.aica.product_resource.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductionPlanDTO {

    private int id;
    private String enterprise;
    private String name;
    private Integer planThisYear;
    private Integer planNextYear;

    public Integer getPlanThisYear() {
        return planThisYear == null ? 0 : planThisYear;
    }

    public Integer getPlanNextYear() {
        return planNextYear  == null ? 0 : planNextYear;
    }
}
