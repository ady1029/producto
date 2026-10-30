package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ResourceTypeDTO;
import cu.aica.product_resource.api.dto.ResourceTypeDTOComparator;
import cu.aica.product_resource.models.ResourceType;
import cu.aica.product_resource.services.ResourceTypeService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("v1 Resource Type")
@RequestMapping(ApiVersion.URL_BASE_V1+"/resource_type")
@Api(tags = "Tipo de recurso", description = "Endpoints para el CRUD de los tipos de recursos.")
public class ResourceTypeController {

    @Autowired
    private ResourceTypeService service;

    @GetMapping("")
    @ApiOperation(value = "Obtener todas los tipos de recursos paginados", notes = "Retorna la lista paginada de tipos de recursos que coinciden con los parámetros introducidos.")
    public Page<ResourceTypeDTO> getAllFilterByAttributes(
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "Código de Empresa") Integer idEnterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre del tipo de recurso") String name,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, enterprise, name") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {

        List<ResourceTypeDTO> listDTO = service.getAllFilter(idEnterprise, enterprise, name);

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        listDTO.sort(new ResourceTypeDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize*(page+1);
        int min = page > totalpages ? max : pageSize*page;

        return new PageImpl<ResourceTypeDTO>(listDTO.subList(min, max), paging, listDTO.size());
    }

    @GetMapping("/list")
    @ApiOperation(value = "Obtener listado de tipos de recursos", notes = "Retorna la lista de tipos de recursos que coinciden con los parámetros introducidos.")
    public List<ResourceType> getAllFilterByAttributes(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "Código de Empresa") Integer idEnterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre") String name) {
        return service.getAllFilterIdEnterpriseAndName(idEnterprise, name);
    }

    @GetMapping(value = "/{id}")
    @ApiOperation(value="Obtener tipo de recurso", notes = "Retorna una tipo de recurso dado su identificador.")
    public ResourceType getById(@PathVariable @ApiParam(value = "Identificador de tipo de recurso", required = true) int id){
        return service.getById(id);
    }

    @PostMapping(value = "")
    @ApiOperation(value="Insertar tipo de recurso", notes = "Retorna el tipo de recurso que se ha insertado.")
    public ResourceType insert(@RequestBody ResourceType entity){
        return service.save(entity);
    }

    @PutMapping(value = "")
    @ApiOperation(value="Editar tipo de recurso", notes = "Retorna el tipo de recurso que se ha editado.")
    public ResourceType update(@RequestBody ResourceType entity){
        return service.save(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar tipo de recurso", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"restricted\" si hay alguna restricción, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de tipo de recurso", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }
}
