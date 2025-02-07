import { ICompressGateway } from '../../Gateways/ICompressGateway'
import { readdirSync } from 'fs'
import admz from 'adm-zip'
import { Either, Left, Right } from '../../@Shared/Either'

export class CompressToZip implements ICompressGateway {
  compressImagesToZip(rawImagesPath: string): Either<Error, string> {
    console.log('Compressing images to zip')
    try {
      const zip = new admz()
      const folderToBeZipped = readdirSync(rawImagesPath)
      const imagesZipped = `${rawImagesPath}.zip`

      for (let i = 0; i < folderToBeZipped.length; i++) {
        const image = folderToBeZipped[i]
        zip.addLocalFile(`${rawImagesPath}/${image}`)
      }

      zip.writeZip(imagesZipped)

      return Right(imagesZipped)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
