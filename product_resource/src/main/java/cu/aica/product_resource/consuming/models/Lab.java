package cu.aica.product_resource.consuming.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Lab {

    @JsonProperty("codigo")
    private Integer codigo;
    @JsonProperty("nombre")
    private String nombre;
    @JsonProperty("entidad")
    private String entidad;
    @JsonProperty("Descripcion")
    private String descripcion;

    public Lab() {
        this.codigo = -1;
        this.nombre = "";
        this.entidad = "";
        this.descripcion = "";
    }

    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEntidad() {
        return entidad;
    }

    public void setEntidad(String entidad) {
        this.entidad = entidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
