package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.RelationDTO;
import cu.aica.product_resource.api.dto.RelationDTOComparator;
import cu.aica.product_resource.consuming.services.EntityService;
import cu.aica.product_resource.consuming.models.Entity;
import cu.aica.product_resource.models.Relation;
import cu.aica.product_resource.services.RelationService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController("v1 Relation")
@RequestMapping(ApiVersion.URL_BASE_V1+"/relation")
@Api(tags = "Relaciones", description = "Endpoints para el CRUD de las relaciones.")
public class RelationController {

    @Autowired
    private RelationService service;

    @Autowired
    private EntityService entityService;

    @GetMapping("")
    @ApiOperation(value = "Obtener todas las relaciones paginadas", notes = "Retorna la lista paginada de relaciones que coinciden con los parámetros introducidos.")
    public Page<RelationDTO> getAllFilter(
            @RequestParam(defaultValue = "") @ApiParam(value = "Empresa de la familia de producto") String productFamilyEnterprise,
            @RequestParam(defaultValue = "") @ApiParam(value = "Nombre de la familia de producto") String productFamilyName,
            @RequestParam(defaultValue = "") @ApiParam(value = "Nombre de la relación") String name,
            @RequestParam(defaultValue = "") @ApiParam(value = "Criterio") String criterio,
            @RequestParam(defaultValue = "") @ApiParam(value = "Fecha") String date,
            @RequestParam(defaultValue = "") @ApiParam(value = "Cantidad base") String baseCount,
            @RequestParam(defaultValue = "") @ApiParam(value = "Nombre de la familia de recurso base") String resourceFamilyName,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, productFamilyEnterprise, productFamilyName, name, criterio, date, baseCount, resourceFamilyName") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {

//        ModelMapper mapper = new ModelMapper();
//        return service.getAllFilter(idProduct, search, page, pageSize, sortBy, sort).stream().map(item -> mapper.map(item, RelationDTO.class));

        ModelMapper mapper = new ModelMapper();
        List<RelationDTO> listDTO = new ArrayList<>();

        List<Entity> entities = entityService.getAllEntity();

        service.getAllFilter(productFamilyName, name, criterio, date, baseCount, resourceFamilyName).forEach(item -> {
            RelationDTO relationDTO = mapper.map(item, RelationDTO.class);

            relationDTO.setProductFamilyEnterprise(entities.stream().filter(entity -> entity.getId() == item.getProductFamily().getIdEnterprise()).findFirst().orElse(new Entity()).getName());

            if (relationDTO.getProductFamilyEnterprise().toLowerCase().contains(productFamilyEnterprise.toLowerCase()))
                listDTO.add(relationDTO);
        });

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        listDTO.sort(new RelationDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize * (page + 1);
        int min = page > totalpages ? max : pageSize * page;

        return new PageImpl<RelationDTO>(listDTO.subList(min, max), paging, listDTO.size());
    }

    @GetMapping(value = "/{id}")
    @ApiOperation(value = "Obtener relación", notes = "Retorna una relación dado su identificador.")
    public Relation getById(@PathVariable @ApiParam(value = "Identificador de relación", required = true) int id) {
        return service.getById(id);
    }

    @PostMapping(value = "")
    @ApiOperation(value = "Insertar relación", notes = "Retorna la relación que se ha insertada.")
    public Relation insert(@RequestBody Relation entity) {
        return service.save(entity);
    }

    @PutMapping(value = "")
    @ApiOperation(value = "Editar relación", notes = "Retorna la relación que se ha editada.")
    public Relation update(@RequestBody Relation entity) {
        return service.save(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar relación", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de relación", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }
}
