package cu.aica.product_resource.consuming.models;

import com.fasterxml.jackson.annotation.JsonProperty;

//@JsonIgnoreProperties(ignoreUnknown = true)
public class Entity {


    private Integer id;
    @JsonProperty("nombre")
    private String name;
    @JsonProperty("tipo")
    private String type;
    @JsonProperty("largeName")
    private String largeName;
    @JsonProperty("Descripcion")
    private String description;

    public Entity() {
        this.id = -1;
        this.name = "";
        this.type = "";
        this.largeName = "";
        this.description = "";
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLargeName() {
        return largeName;
    }

    public void setLargeName(String largeName) {
        this.largeName = largeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

 /*   @Override
    public String toString() {
        return "Value{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", largeName='" + largeName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }*/
}
