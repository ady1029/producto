package cu.aica.product_resource.consuming.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResourceMistral {

    @JsonProperty("REFERENCIA")
    private String codigo;
    @JsonProperty("DESCRIPCION")
    private String name;
    @JsonProperty("UM")
    private String measureUnit;
    @JsonProperty("CANTIDAD")
    private Double count;

    public ResourceMistral() {
        this.codigo = "";
        this.name = "";
        this.measureUnit = "";
        this.count = 0.0;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMeasureUnit() {
        return measureUnit;
    }

    public void setMeasureUnit(String measureUnit) {
        this.measureUnit = measureUnit;
    }

    public Double getCount() {
        return count;
    }

    public void setCount(Double count) {
        this.count = count;
    }
}
