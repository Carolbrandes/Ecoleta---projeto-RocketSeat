import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './DropZone.css';
import { FiUpload } from 'react-icons/fi';

interface Props{
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    // useCallback => é usada para recarregar a funcao somente qd algum valor for alterado.
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        // para criar uma url do arquivo 
        const fileUrl = URL.createObjectURL(file); 

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded])

    const {getRootProps, getInputProps} = useDropzone({onDrop, accept: 'image/*'})

    return(
        <div className="dropzone" {...getRootProps()}>
            {/* se quisessemos receber mais de um arquivo no input usariamos a propriedade multiple  */}
            <input {...getInputProps} accept="image/*"/>
           
           {
           selectedFileUrl ? <img src={selectedFileUrl} alt="Point thumbnail"/> : <p> <FiUpload/> Imagem do estabelecimento</p>
           }
        </div>
    )
}

export default Dropzone;