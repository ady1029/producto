package cu.aica.product_resource.consuming.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductMistral {

    @JsonProperty("CUP")
    private String cup;
    @JsonProperty("DESCRIPCION")
    private String name;
    @JsonProperty("FORMA_FARMACEUTICA")
    private String pharmaceuticShape;
    @JsonProperty("UNIDAD_MEDIDA")
    private String measureUnit;
    @JsonProperty("MERCADO")
    private String market;

    public ProductMistral() {
        this.cup = "";
        this.name = "";
        this.pharmaceuticShape = "";
        this.measureUnit = "";
        this.market = "";
    }

    public String getCup() {
        return cup;
    }

    public void setCup(String cup) {
        this.cup = cup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPharmaceuticShape() {
        return pharmaceuticShape;
    }

    public void setPharmaceuticShape(String pharmaceuticShape) {
        this.pharmaceuticShape = pharmaceuticShape;
    }

    public String getMeasureUnit() {
        return measureUnit;
    }

    public void setMeasureUnit(String measureUnit) {
        this.measureUnit = measureUnit;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }
}
