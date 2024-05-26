import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import ImageCompression from 'browser-image-compression';

export const APIContext = createContext();

const ContextProvider = (props) => {
  // navigate hook
  const navigate = useNavigate();

  // Loading state
  const [loading, setLoading] = useState(false);
  const [loadingElements, setLoadingElements] = useState(false);

  if (loading) {
    return (
      <ReactLoading
        id='loading'
        style={loading ? { display: '' } : { display: 'none' }}
        type={'spin'}
      />
    );
  }

  // API URL
  //const api = 'http://localhost:3001';
  const api = 'https://loja-online-x9oa.onrender.com';

  // CRUD HEADERS
  const headersCRUD = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };

  // FORM DATA HEADERS
  const headersFORM = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };

  // sign out
  const signOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  //// TOOL FUNCTIONS ////
  //normalize date
  // output: 2021-08-25
  const normalizeDate = (date) => {
    const normalizedDate = new Date(date).toISOString().split('T')[0];
    return normalizedDate;
  };
  
  // compress images
  async function handleImageUpload(imageFile) {
    if (!imageFile) return alert('A imagem não foi carregada corretamente. Tente novamente.');
    //console.log('Original file size:', imageFile.size / 1024 / 1024, 'MB');

    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 400,
        useWebWorker: true
    };

    try {
        const compressedFile = await ImageCompression(imageFile, options);
        //console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
        return compressedFile;
    } catch (error) {
        console.error(error);
    }
}

  return (
    <APIContext.Provider
      value={{
        api,
        headersCRUD,
        headersFORM,
        loading,
        loadingElements,
        setLoading,
        setLoadingElements,
        navigate,
        normalizeDate,
        handleImageUpload,
        signOut,
      }}
    >
      {props.children}
    </APIContext.Provider>
  );
};
export default ContextProvider;
