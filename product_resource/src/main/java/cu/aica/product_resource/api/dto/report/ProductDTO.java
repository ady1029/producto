package cu.aica.product_resource.api.dto.report;

public class ProductDTO {

    private Integer id;
    private Integer idProductFamily;
    private Integer codUeb;
    private String ueb;
    private String name;
    private String cup;
    private String pharmaceuticShape;
    private String market;
    private String codigo;
    private Boolean selected;

    public ProductDTO() {
    }

    public ProductDTO(Integer id, Integer idProductFamily, Integer codUeb, String ueb, String name, String cup, String pharmaceuticShape, String market, String codigo, Boolean selected) {
        this.id = id;
        this.idProductFamily = idProductFamily;
        this.codUeb = codUeb;
        this.ueb = ueb;
        this.name = name;
        this.cup = cup;
        this.pharmaceuticShape = pharmaceuticShape;
        this.market = market;
        this.codigo = codigo;
        this.selected = selected;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdProductFamily() {
        return idProductFamily;
    }

    public void setIdProductFamily(Integer idProductFamily) {
        this.idProductFamily = idProductFamily;
    }

    public Integer getCodUeb() {
        return codUeb;
    }

    public void setCodUeb(Integer codUeb) {
        this.codUeb = codUeb;
    }

    public String getUeb() {
        return ueb;
    }

    public void setUeb(String ueb) {
        this.ueb = ueb;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCup() {
        return cup;
    }

    public void setCup(String cup) {
        this.cup = cup;
    }

    public String getPharmaceuticShape() {
        return pharmaceuticShape;
    }

    public void setPharmaceuticShape(String pharmaceuticShape) {
        this.pharmaceuticShape = pharmaceuticShape;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }
}
