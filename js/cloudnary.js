'use strict'

const CLOUD_NAME = 'daxpl0xw3'     
const UPLOAD_PRESET = 'fotos_contato' 

export async function uploadParaCloudinary(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const options = {
        method: 'POST',
        body: formData
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.secure_url
}