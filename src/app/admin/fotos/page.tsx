"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface for Foto data
interface Foto {
  id: number;
  titulo: string;
  data: string;
  descricao: string;
  foto: string;
}

export default function FotosRecentesAdmin() {
  const router = useRouter();
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [currentFoto, setCurrentFoto] = useState<Foto>({
    id: 0,
    titulo: "",
    data: "",
    descricao: "",
    foto: ""
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFotos();
  }, []);

  const fetchFotos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/fotos");
      if (!response.ok) {
        throw new Error("Falha ao carregar fotos");
      }
      const data = await response.json();
      setFotos(data);
    } catch (error) {
      setErrorMessage("Erro ao carregar fotos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentFoto({ ...currentFoto, [name]: value });
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Store the file in state
      setFotoFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const createFoto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add foto data
      formData.append("titulo", currentFoto.titulo);
      formData.append("descricao", currentFoto.descricao);
      formData.append("data", currentFoto.data);

      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      const response = await fetch("/api/fotos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao criar foto");
      }

      setSuccessMessage("Foto criada com sucesso!");
      setIsCreating(false);
      resetForm();
      fetchFotos();
    } catch (error) {
      setErrorMessage("Erro ao criar foto");
      console.error(error);
    }
  };

  const updateFoto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add foto data
      formData.append("id", String(currentFoto.id));
      formData.append("titulo", currentFoto.titulo);
      formData.append("descricao", currentFoto.descricao);
      formData.append("data", currentFoto.data);

      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      const response = await fetch(`/api/fotos/${currentFoto.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar foto");
      }

      setSuccessMessage("Foto atualizada com sucesso!");
      setIsEditing(false);
      resetForm();
      fetchFotos();
    } catch (error) {
      setErrorMessage("Erro ao atualizar foto");
      console.error(error);
    }
  };

  const deleteFoto = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/fotos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir foto");
      }

      setSuccessMessage("Foto excluída com sucesso!");
      fetchFotos();
    } catch (error) {
      setErrorMessage("Erro ao excluir foto");
      console.error(error);
    }
  };

  const editFoto = (foto: Foto) => {
    setCurrentFoto(foto);
    setIsEditing(true);
    setIsCreating(false);
  };

  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  const resetForm = () => {
    setCurrentFoto({
      id: 0,
      titulo: "",
      data: "",
      descricao: "",
      foto: ""
    });
    setFotoFile(null);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    resetForm();
  };

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
  <div className="bg-gray-50 min-h-screen">
    <div className="container mx-auto py-8 px-4">
      {/* Cabeçalho com Design Moderno */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Fotos Recentes</h1>
        <div className="h-1 w-24 bg-blue-600 rounded"></div>
      </div>

      {/* Mensagens de Alerta */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center shadow-sm">
          <div className="mr-3">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 flex items-center shadow-sm">
          <div className="mr-3">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Botão de Adicionar */}
      {!isCreating && !isEditing && (
        <div className="mb-6">
          <button
            onClick={startCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center shadow-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Nova Foto
          </button>
        </div>
      )}

      {/* Formulário com Design Aprimorado */}
      {(isCreating || isEditing) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            {isCreating ? (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Nova Foto
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Foto
              </>
            )}
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={currentFoto.titulo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formatDateForInput(currentFoto.data)}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                name="descricao"
                value={currentFoto.descricao}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
              <input
                type="file"
                onChange={handleFotoChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                accept="image/*"
                {...(isCreating ? { required: true } : {})}
              />
              {currentFoto.foto && !fotoFile && (
                <div className="mt-3 flex items-center">
                  <div className="relative h-32 w-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={currentFoto.foto}
                      alt={currentFoto.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Imagem atual</p>
                    <p className="text-xs text-gray-500 mt-1">{currentFoto.foto.split('/').pop()}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={isCreating ? createFoto : updateFoto}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {isCreating ? "Criar Foto" : "Salvar Alterações"}
              </button>

              <button
                onClick={cancelForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela com Design Aprimorado */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : fotos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma foto encontrada
                  </td>
                </tr>
              ) : (
                fotos.map((foto) => (
                  <tr key={foto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{foto.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{foto.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(foto.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {foto.descricao?.length > 50 
                        ? `${foto.descricao.substring(0, 50)}...` 
                        : foto.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {foto.foto && (
                        <div className="h-16 w-24 rounded-md overflow-hidden border border-gray-200 bg-gray-50 relative">
                          <Image
                            src={foto.foto}
                            alt={foto.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editFoto(foto)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md transition duration-200 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => deleteFoto(foto.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition duration-200 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
}