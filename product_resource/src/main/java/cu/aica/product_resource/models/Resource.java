package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "resource", schema = "public", catalog = "product_resource")
public class Resource {
    private Integer id;
    private Integer idResourceFamily;
    @NotNull(message = "UEB is required.")
    private Integer codUeb;
    @NotNull(message = "Codigo is required.")
    @NotEmpty(message = "Enter a valid Codigo.")
    private String codigo;
    @NotNull(message = "Storage is required.")
    @NotEmpty(message = "Enter a valid Storage.")
    private String storage;
    private ResourceFamily resourceFamily;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "resource_id_seq")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "id_resource_family")
    public Integer getIdResourceFamily() {
        return idResourceFamily;
    }

    public void setIdResourceFamily(Integer idResourceFamily) {
        this.idResourceFamily = idResourceFamily;
    }

    @Basic
    @Column(name = "cod_ueb", nullable = false, length = 256)
    public Integer getCodUeb() {
        return codUeb;
    }

    public void setCodUeb(Integer codUeb) {
        this.codUeb = codUeb;
    }

    @Basic
    @Column(name = "codigo", nullable = false, length = 256)
    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @Basic
    @Column(name = "storage", nullable = false, length = 256)
    public String getStorage() {
        return storage;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Resource resource = (Resource) o;
        return Objects.equals(id, resource.id) &&
                Objects.equals(idResourceFamily, resource.idResourceFamily) &&
                Objects.equals(codUeb, resource.codUeb) &&
                Objects.equals(codigo, resource.codigo) &&
                Objects.equals(storage, resource.storage);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, idResourceFamily, codUeb, codigo, storage);
    }

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_resource_family", referencedColumnName = "id", insertable=false, updatable=false)
    public ResourceFamily getResourceFamily() {
        return resourceFamily;
    }

    public void setResourceFamily(ResourceFamily resourceFamily) {
        this.resourceFamily = resourceFamily;
    }
}
