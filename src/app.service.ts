import { Readable } from 'stream';
import fs from 'fs'
import { Injectable, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import * as csv from 'fast-csv'
import { compareArrays } from './helpers/compare-arrays.helper';
import { parseInput } from './helpers/parse-input.helper';

@Injectable()
export class AppService {

  parseCSV(file: Express.Multer.File): Promise<{[x:string]:any}>{  

    return new Promise((resolve,reject)=>{
      const readStream = new Readable({
        read(){
          this.push(file.buffer)
          this.push(null)
        }
      })
  
      const rows = []
      let isInHeaderRow = true
      let headers = []
  
      csv.parseStream(readStream)
      .on('error', error => {console.error(error);throw new InternalServerErrorException("Error al parsear CSV")})
      .on('data', row => {
  
        if(isInHeaderRow) {headers = row; isInHeaderRow = false ;return}
  
        const value: {[x:string]:any} = {}
        let i = 0
        for(const header of headers){
          value[header] = parseInput(row[i])
          i++
        }
        rows.push(value)
  
      })
      .on('end',()=>resolve(rows))
    })

  }

  async formatCSV(inputs: {[x:string]:any}[]){

    const rows: any[] = []
    let headers: any[] = [] 

    let i = 0
    let j = 0
    for (const input of inputs) {
      j=i
      //GET HEADERS, WILL USE FIRST INPUTS KEYS AS HEADERS

      if(i === 0) headers = (Object.keys(input))      
      if(!compareArrays(headers,Object.keys(input))) throw new UnprocessableEntityException("Todos los valores del CSV deben estar en el mismo orden");
      
      for (const inputMap of Object.entries(input)) {
        if(!headers.includes(inputMap[0])) throw new UnprocessableEntityException("Todos los valores del CSV deben de coincidir");
        
        if(j===i){
          rows.push([])
        }
        rows[i].push(inputMap[1])
        j++
      }
      i++
    }

    const result = await csv.writeToBuffer(rows,{headers})

    return result

  }
}
