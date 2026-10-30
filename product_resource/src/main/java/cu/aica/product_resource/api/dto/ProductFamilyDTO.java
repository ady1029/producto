package cu.aica.product_resource.api.dto;

import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class ProductFamilyDTO{

    private Integer id;
    private Integer idEnterprise;
    private String enterprise;
    private String uebs;
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
    private List<ProductDTO> productList;

    public ProductFamilyDTO(Integer id, Integer idEnterprise, String enterprise, String name, String pharmaceuticShape, String format, Boolean lyophilized,
                            Boolean reserve, String atc, Integer priority, Integer nationalDemand, Date updated, Integer planThisYear, Integer planNextYear) {
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
        this.planThisYear = planThisYear;
        this.planNextYear = planNextYear;
    }

    public ProductFamilyDTO(Integer id, Integer idEnterprise, String enterprise, String uebs, String name, String pharmaceuticShape, String format, Boolean lyophilized,
                            Boolean reserve, String atc, Integer priority, Integer nationalDemand, Date updated, List<ProductDTO> productList,
                            Integer planThisYear, Integer planNextYear) {
        this.id = id;
        this.idEnterprise = idEnterprise;
        this.enterprise = enterprise;
        this.uebs = uebs;
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
        this.planThisYear = planThisYear;
        this.planNextYear = planNextYear;
    }

    public Integer getPlanThisYear() {
        return planThisYear == null ? 0 : planThisYear;
    }

    public Integer getPlanNextYear() {
        return planNextYear  == null ? 0 : planNextYear;
    }

}
