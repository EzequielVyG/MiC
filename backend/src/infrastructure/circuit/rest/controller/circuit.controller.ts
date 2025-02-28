import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put
} from '@nestjs/common';
import { CreateCircuit } from 'src/domain/circuit/case/createCircuit.case';
import { DeleteCircuit } from 'src/domain/circuit/case/deleteCircuit.case';
import { FindCircuits } from 'src/domain/circuit/case/finByCircuits.case';
import { FindByCategory } from 'src/domain/circuit/case/findByCategory.case';
import { UpdateCircuit } from 'src/domain/circuit/case/updateCircuit.case';
import { Circuit } from 'src/domain/circuit/model/circuit.entity';
import { responseJson } from 'src/util/responseMessage';
import { CircuitInput } from '../input/circuit-input';
import { UpdateCircuitInput } from '../input/update-circuit-input';
import { CircuitRestMapper } from '../mapper/circuit-rest-mapper';
import { CircuitPayload } from '../payload/circuit-payload';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('circuits')
export class CircuitController {
    constructor(
        private readonly findCircuits: FindCircuits,
        private readonly createCircuit: CreateCircuit,
        private readonly deleteCircuit: DeleteCircuit,
        private readonly updateCircuit: UpdateCircuit,
        private readonly findCircuitsByCategory: FindByCategory
    ) { }

    @Get()
    async findAll(): Promise<CircuitPayload[]> {
        try {
            const someCircuits: Circuit[] = await this.findCircuits.findAll();
            return responseJson(
                200,
                'Circuitos recuperados con exito',
                someCircuits.map((aCircuit) => {
                    return CircuitRestMapper.toPayload(aCircuit);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Get('id/:id')
    async findById(@Param('id') id: string): Promise<CircuitPayload> {
        try {
            const aCircuit: Circuit = await this.findCircuits.findById(id);
            return aCircuit
                ? responseJson(200, 'Circuito recuperado con exito', aCircuit)
                : responseJson(500, 'No existe ese circuito');
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Get('/byCategory/:categoryId')
    async findByCategory(
        @Param('categoryId') categoryId: string
    ): Promise<CircuitPayload[]> {
        try {
            const somePlaces: Circuit[] = await this.findCircuitsByCategory.findAll(
                categoryId
            );
            return responseJson(
                200,
                'Circuitos filtrados por categoría recuperados con exito',
                somePlaces.map((aPlace) => {
                    return CircuitRestMapper.toPayload(aPlace);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post()
    async create(
        @Body() circuit: CircuitInput,
    ): Promise<CircuitPayload> {
        try {
            const aCircuit: Circuit = await this.createCircuit.create(
                circuit.name,
                circuit.description,
                circuit.places,
                circuit.principalCategory,
                circuit.categories,
            );

            return responseJson(
                200,
                'Circuito creado con exito',
                CircuitRestMapper.toPayload(aCircuit)
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Delete('/id/:id')
    async delete(@Param('id') id: string): Promise<CircuitPayload> {
        try {
            const aCircuit: Circuit = await this.deleteCircuit.delete(id);
            return aCircuit
                ? responseJson(
                    200,
                    `${aCircuit.name} eliminado con exito`,
                    CircuitRestMapper.toPayload(aCircuit)
                )
                : responseJson(500, 'No existe un circuito con ese id');
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Put()
    async update(
        @Body() circuit: UpdateCircuitInput,
    ): Promise<CircuitPayload> {

        try {
            const aCircuit = await this.updateCircuit // Pasarle las categories también
                .update(
                    circuit.id,
                    circuit.name,
                    circuit.description,
                    circuit.places,
                    circuit.principalCategory,
                    circuit.categories,
                );

            return aCircuit
                ? responseJson(
                    200,
                    'Circuito actualizado con exito',
                    CircuitRestMapper.toPayload(aCircuit)
                )
                : responseJson(500, 'El circuito no existe');
        } catch (error) {
            return responseJson(500, error.message);
        }
    }
}
