package cu.aica.product_resource.api.dto;

import java.util.Date;

public class RelationDTO {

    private int id;
    private Integer idProductFamily;
    private Integer productFamilyIdEnterprise;
    private String productFamilyEnterprise;
    private String productFamilyName;
    private String name;
    private String criterio;
    private Date date;
    private Integer baseCount;
    private Integer idResourceFamily;
    private String resourceFamilyName;

    public RelationDTO() {
    }

    public RelationDTO(int id, Integer idProductFamily, Integer productFamilyIdEnterprise, String productFamilyEnterprise, String productFamilyName, String name, String criterio, Date date, Integer baseCount, Integer idResourceFamily, String resourceFamilyName) {
        this.id = id;
        this.idProductFamily = idProductFamily;
        this.productFamilyIdEnterprise = productFamilyIdEnterprise;
        this.productFamilyEnterprise = productFamilyEnterprise;
        this.productFamilyName = productFamilyName;
        this.name = name;
        this.criterio = criterio;
        this.date = date;
        this.baseCount = baseCount;
        this.idResourceFamily = idResourceFamily;
        this.resourceFamilyName = resourceFamilyName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getIdProductFamily() {
        return idProductFamily;
    }

    public void setIdProductFamily(Integer idProductFamily) {
        this.idProductFamily = idProductFamily;
    }

    public Integer getProductFamilyIdEnterprise() {
        return productFamilyIdEnterprise;
    }

    public void setProductFamilyIdEnterprise(Integer productFamilyIdEnterprise) {
        this.productFamilyIdEnterprise = productFamilyIdEnterprise;
    }

    public String getProductFamilyEnterprise() {
        return productFamilyEnterprise;
    }

    public void setProductFamilyEnterprise(String productFamilyEnterprise) {
        this.productFamilyEnterprise = productFamilyEnterprise;
    }

    public String getProductFamilyName() {
        return productFamilyName;
    }

    public void setProductFamilyName(String productFamilyName) {
        this.productFamilyName = productFamilyName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCriterio() {
        return criterio;
    }

    public void setCriterio(String criterio) {
        this.criterio = criterio;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getBaseCount() {
        return baseCount;
    }

    public void setBaseCount(Integer baseCount) {
        this.baseCount = baseCount;
    }

    public Integer getIdResourceFamily() {
        return idResourceFamily;
    }

    public void setIdResourceFamily(Integer idResourceFamily) {
        this.idResourceFamily = idResourceFamily;
    }

    public String getResourceFamilyName() {
        return resourceFamilyName;
    }

    public void setResourceFamilyName(String resourceFamilyName) {
        this.resourceFamilyName = resourceFamilyName;
    }
}
