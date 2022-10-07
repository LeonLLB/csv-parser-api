import { Readable } from 'stream';
import fs from 'fs'
import { Injectable } from '@nestjs/common';
import * as csv from 'fast-csv'

@Injectable()
export class AppService {

  parseCSV(file: Express.Multer.File){

    console.log(file)
    
  }

  async formatCSV(inputs: {[x:string]:any}[]){

    // const csvStream = csv.format()

    // csvStream.pipe(process.stdout)

    const rows: any[] = []
    const headers: any[] = [] 

    let i = 0
    let j = 0
    for (const input of inputs) {
      j=i
      for (const inputMap of Object.entries(input)) {
        if(!headers.includes(inputMap[0])) headers.push(inputMap[0])
        if(j===i){
          rows.push([])
        }
        rows[i].push(inputMap[1])
        j++
      }
      i++
    }

    const result = await csv.writeToString(rows,{headers})
    console.log(result)

    return rows

  }
}
