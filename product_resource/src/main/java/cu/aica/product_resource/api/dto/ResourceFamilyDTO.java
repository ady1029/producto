package cu.aica.product_resource.api.dto;

public class ResourceFamilyDTO {

    private int id;
    private Integer idEnterprise;
    private String enterprise;
    private String name;

    public ResourceFamilyDTO() {
    }

    public ResourceFamilyDTO(int id, Integer idEnterprise, String enterprise, String name) {
        this.id = id;
        this.idEnterprise = idEnterprise;
        this.enterprise = enterprise;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getIdEnterprise() {
        return idEnterprise;
    }

    public void setIdEnterprise(Integer idEnterprise) {
        this.idEnterprise = idEnterprise;
    }

    public String getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(String enterprise) {
        this.enterprise = enterprise;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
