package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.models.MeasureUnit;
import cu.aica.product_resource.services.MeasureUnitService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(ApiVersion.URL_BASE_V1+"/measure_unit")
@Api(tags = "Unidad de medida", description = "Endpoints para el CRUD de las unidades de medida.")
public class MeasureUnitController {

    @Autowired
    private MeasureUnitService service;

    @GetMapping("")
    @ApiOperation(value = "Obtener todas las unidades de medidas", notes = "Retorna la lista de unidades de medidas que coinciden con los parámetros introducidos.")
    public List<MeasureUnit> getAllFilterByAttributes(
            @RequestParam(defaultValue = "") @ApiParam(value = "Nombre") String name) {
        return service.getAllFilterByAttributes(name);
    }


    @GetMapping(value = "/{id}")
    @ApiOperation(value="Obtener unidad de medida", notes = "Retorna una unidad de medida dado su identificador.")
    public MeasureUnit getById(@PathVariable @ApiParam(value = "Identificador de unidad de medida", required = true) int id){
        return service.getById(id);
    }

    @PostMapping(value = "")
    @ApiOperation(value="Insertar unidad de medida", notes = "Retorna la unidad de medida que se ha insertada.")
    public MeasureUnit insert(@RequestBody MeasureUnit entity){
        return service.save(entity);
    }

    @PutMapping(value = "")
    @ApiOperation(value="Editar unidad de medida", notes = "Retorna la unidad de medida que se ha editada.")
    public MeasureUnit update(@RequestBody MeasureUnit entity){
        return service.save(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar unidad de medida", notes = "Retorna \"successful\" en caso que se eliminó correctamente,  \"restricted\" si hay alguna restricción, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de unidad de medida", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }


}
