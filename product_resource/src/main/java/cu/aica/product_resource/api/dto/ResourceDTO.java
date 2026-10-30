package cu.aica.product_resource.api.dto;

public class ResourceDTO {


    private int id;
    private Integer idResourceFamily;
    private Integer codUeb;
    private String ueb;
    private String storage;
    private String name;
    private String codigo;
    private String mistralCount;


    public ResourceDTO() {
    }

    public ResourceDTO(int id, Integer idResourceFamily, Integer codUeb, String ueb, String storage, String name, String codigo, String mistralCount) {
        this.id = id;
        this.idResourceFamily = idResourceFamily;
        this.codUeb = codUeb;
        this.ueb = ueb;
        this.storage = storage;
        this.name = name;
        this.codigo = codigo;
        this.mistralCount = mistralCount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getIdResourceFamily() {
        return idResourceFamily;
    }

    public void setIdResourceFamily(Integer idResourceFamily) {
        this.idResourceFamily = idResourceFamily;
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

    public String getStorage() {
        return storage;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getMistralCount() {
        return mistralCount;
    }

    public void setMistralCount(String mistralCount) {
        this.mistralCount = mistralCount;
    }

}
