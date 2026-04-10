"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { MensagemPastor } from "@/types/mensagemPastoral";
import { formatDateForDisplay } from "@/utils/formatoData";

export default function MensagemPastoralAdmin() {
  const [mensagem, setMensagem] = useState<MensagemPastor | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estado do formulário
  const [currentMensagem, setCurrentMensagem] = useState<MensagemPastor>({
    id: 0,
    titulo: "",
    foto: "",
    mensagem: "",
  });

  useEffect(() => {
    fetchMensagemPastoral();
  }, []);

  const fetchMensagemPastoral = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mensagem-pastoral");
      if (!response.ok) {
        throw new Error("Falha ao carregar mensagem pastoral");
      }
      const data = await response.json();

      // Pegamos apenas a primeira mensagem, já que é única
      setMensagem(data.length > 0 ? data[0] : null);

    } catch (error) {
      setErrorMessage("Erro ao carregar mensagem pastoral");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentMensagem({ ...currentMensagem, [name]: value });
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const saveMensagemPastoral = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      formData.append("titulo", currentMensagem.titulo);

      formData.append("mensagem", currentMensagem.mensagem);

      if (foto) {
        formData.append("foto", foto);
      }

      let response;
      if (mensagem) {
        // Atualizar mensagem existente
        formData.append("id", String(mensagem.id));
        response = await fetch(`/api/mensagem-pastoral/${mensagem.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Criar nova mensagem
        response = await fetch("/api/mensagem-pastoral", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error("Falha ao salvar mensagem pastoral");
      }

      setSuccessMessage("Mensagem pastoral salva com sucesso!");
      setIsFormOpen(false);
      resetForm();
      fetchMensagemPastoral();
    } catch (error) {
      setErrorMessage("Erro ao salvar mensagem pastoral");
      console.error(error);
    }
  };

  const deletarMensagemPastoral = async () => {
    if (!mensagem) return;

    if (!confirm("Tem certeza que deseja excluir esta mensagem pastoral?")) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/mensagem-pastoral/${mensagem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir mensagem pastoral");
      }

      setSuccessMessage("Mensagem pastoral excluída com sucesso!");
      setMensagem(null);
    } catch (error) {
      setErrorMessage("Erro ao excluir mensagem pastoral");
      console.error(error);
    }
  };

  const editMensagemPastoral = () => {
    if (!mensagem) return;

    setCurrentMensagem(mensagem);
    setIsFormOpen(true);
  };

  const startCreating = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setCurrentMensagem({
      id: 0,
      titulo: "",
      foto: "",
      mensagem: "",
    });
    setFoto(null);
  };

  const cancelForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Cabeçalho com Design Moderno */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento da Mensagem Pastoral</h1>
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
        {!isFormOpen && !mensagem && !isLoading && (
          <div className="mb-6">
            <button
              onClick={startCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center shadow-sm"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Mensagem Pastoral
            </button>
          </div>
        )}

        {/* Formulário com Design Aprimorado */}
        {isFormOpen && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              {mensagem ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Mensagem Pastoral
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Adicionar Mensagem Pastoral
                </>
              )}
            </h2>

            <form onSubmit={saveMensagemPastoral} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={currentMensagem.titulo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
                <textarea
                  name="mensagem"
                  value={currentMensagem.mensagem}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                  placeholder="Digite a mensagem pastoral aqui..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Orador</label>
                <input
                  type="file"
                  onChange={handleFotoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                  accept="image/*"
                />
                {currentMensagem.foto && !foto && (
                  <div className="mt-3 flex items-center">
                    <div className="relative h-32 w-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image
                        unoptimized  
                        src={currentMensagem.foto}
                        alt="Imagem do orador"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Imagem atual</p>
                      <p className="text-xs text-gray-500 mt-1">{currentMensagem.foto.split('/').pop()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {mensagem ? "Salvar Alterações" : "Criar Mensagem"}
                </button>

                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Estado de Carregamento */}
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center">
            <div className="flex justify-center items-center mb-4">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Carregando mensagem pastoral...</p>
          </div>
        ) : mensagem ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Cabeçalho do Card */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Mensagem Pastoral Atual</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editMensagemPastoral}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md flex items-center transition duration-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={deletarMensagemPastoral}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center transition duration-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </button>
              </div>
            </div>

            {/* Conteúdo principal - layout em duas colunas */}
            <div className="flex flex-col md:flex-row">
              {/* Coluna da imagem */}
              {mensagem.foto && (
                <div className="md:w-1/3 p-6 flex justify-center items-start">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      unoptimized  
                      src={mensagem.foto}
                      alt={`Foto de ${mensagem.titulo}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Coluna da mensagem */}
              <div className={`${mensagem.foto ? 'md:w-2/3' : 'w-full'} p-6`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{mensagem.titulo}</h2>
                <div className="prose max-w-none">
                  {mensagem.mensagem.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé com data (opcional) */}
            {mensagem.data_publicacao && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 flex items-center">
                  <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Data da publicação:</span> {formatDateForDisplay(mensagem.data_publicacao)}
                </div>
              </div>
            )}
          </div>
        ) : !isFormOpen && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center border border-dashed border-gray-300">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-600 mb-4">Nenhuma mensagem pastoral encontrada</p>
            <button
              onClick={startCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center shadow-sm mx-auto"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Mensagem Pastoral
            </button>
          </div>
        )}
      </div>
    </div>
  );
}