import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { getStorage, ref } from 'firebase/storage';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
@Injectable()
export class UploadService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  create(createUploadDto: CreateUploadDto) {
    return 'This action adds a new upload';
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }

  uploadOneFile(file: File) {
    const fileName = `${file.name}${Date.now()}`;
    const storage = getStorage();
    const fileRef = ref(storage, fileName);
    const fileImagesRef = ref(storage, `files/${fileName}`);

    // While the file names are the same, the references point to different files
    console.log(fileRef.name === fileImagesRef.name);
    console.log(fileRef.fullPath === fileImagesRef.fullPath);
  }
}
