package cu.aica.product_resource.api.dto.report;

import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class ProductFamilyDTO {

    private int id;
    private Integer idEnterprise;
    private String enterprise;
    private String name;
    private String pharmaceuticShape;
    private String format;
    private Boolean lyophilized;
    private Boolean reserve;
    private String atc;
    private Integer priority;
    private Integer nationalDemand;
    private Date updated;
    private Integer planThisYear;
    private Integer planNextYear;
    private Double requiredCountPlanThisYear;
    private Double requiredCountPlanNextYear;
    private List<ProductDTO> productList;
    private String relationName;
    private String relationCriterio;
    private Integer relationBaseCount;
    private String resourceType;
    private Double referenceCount;
    private String measureUnit;

    public ProductFamilyDTO() {
    }

    public ProductFamilyDTO(int id, Integer idEnterprise, String enterprise, String name, String pharmaceuticShape, String format,
                            Boolean lyophilized, Boolean reserve, String atc, Integer priority, Integer nationalDemand,
                            Date updated, List<ProductDTO> productList, String relationName, String relationCriterio,
                            Integer relationBaseCount, String resourceType, Double referenceCount, String measureUnit) {
        this.id = id;
        this.idEnterprise = idEnterprise;
        this.enterprise = enterprise;
        this.name = name;
        this.pharmaceuticShape = pharmaceuticShape;
        this.format = format;
        this.lyophilized = lyophilized;
        this.reserve = reserve;
        this.atc = atc;
        this.priority = priority;
        this.nationalDemand = nationalDemand;
        this.updated = updated;
        this.productList = productList;
        this.relationName = relationName;
        this.relationCriterio = relationCriterio;
        this.relationBaseCount = relationBaseCount;
        this.resourceType = resourceType;
        this.referenceCount = referenceCount;
        this.measureUnit = measureUnit;
    }
}
