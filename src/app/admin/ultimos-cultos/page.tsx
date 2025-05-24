"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { CultoYoutube } from "@/types/ultimosCultos";
import { formatDateForDisplay, formatDateForInput } from "@/utils/formatoData";



export default function UltimosCultosAdmin() {
  const router = useRouter();
  const [cultos, setCultos] = useState<CultoYoutube[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const [isLoadingYouTubeData, setIsLoadingYouTubeData] = useState(false);

  // Estado do formulário
  const [currentCulto, setCurrentCulto] = useState<CultoYoutube>({
    id: 0,
    data: "",
    hora: "",
    titulo: "",
    descricao: "",
    linkyoutube: "",
    iframe: "",
  });

  useEffect(() => {
    fetchCultos();
  }, []);

  const fetchCultos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ultimos-cultos");
      if (!response.ok) {
        throw new Error("Falha ao carregar cultos");
      }
      const data = await response.json();
      setCultos(data);
    } catch (error) {
      setErrorMessage("Erro ao carregar cultos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentCulto({ ...currentCulto, [name]: value });

    // Quando o link do YouTube mudar, tente buscar os metadados do vídeo
    if (name === "linkyoutube" && value) {
      fetchYouTubeData(value);
    }
  };

  // Extrair ID do vídeo do YouTube a partir da URL
  const extractYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Buscar dados do vídeo do YouTube
  const fetchYouTubeData = async (url: string) => {
    const videoId = extractYoutubeVideoId(url);
    if (!videoId) return;

    setIsLoadingYouTubeData(true);
    setErrorMessage("");

    try {
      // Substitua pelo seu endpoint de API real
      const response = await fetch(`/api/youtube-data?videoId=${videoId}`);

      if (!response.ok) {
        throw new Error("Falha ao buscar dados do vídeo");
      }

      const data = await response.json();

      if (data && data.items && data.items.length > 0) {
        const videoData = data.items[0];
        const snippet = videoData.snippet;

        // Formatar a data de publicação do vídeo
        const publishedAt = new Date(snippet.publishedAt);
        const formattedTime = publishedAt.toTimeString().substring(0, 5); // Formato HH:MM
        const iframeUrl = `https://www.youtube.com/embed/${videoId}`;


        // Atualizar os campos do formulário com os dados do YouTube
        setCurrentCulto(prev => ({
          ...prev,
          titulo: snippet.title,
          descricao: snippet.description,
          data: snippet.publishedAt,
          hora: formattedTime,
          iframe: iframeUrl
        }));


        setSucessMessage("Dados do YouTube carregados com sucesso!");
      } else {
        throw new Error("Vídeo não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do YouTube:", error);
      setErrorMessage("Não foi possível obter os dados do vídeo do YouTube");
    } finally {
      setIsLoadingYouTubeData(false);
    }
  };

  const createCulto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");

    try {
      // Validar link do YouTube
      const videoId = extractYoutubeVideoId(currentCulto.linkyoutube);
      if (!videoId) {
        setErrorMessage("Link do YouTube inválido");
        return;
      }

      // Preparar dados do culto para envio
      const cultoData = {
        data: currentCulto.data,
        hora: currentCulto.hora,
        titulo: currentCulto.titulo,
        descricao: currentCulto.descricao,
        linkyoutube: currentCulto.linkyoutube,
        iframe: currentCulto.iframe
      };

      const response = await fetch("/api/ultimos-cultos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cultoData),
      });



      if (!response.ok) {
        throw new Error("Falha ao criar Culto");
      }


      setSucessMessage("Culto criado com sucesso!");
      setIsCreating(false);
      resetForm();
      fetchCultos();
    } catch (error) {
      setErrorMessage("Erro ao criar Culto");
      console.error(error);
    }
  };

  const updateCulto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");

    try {
      // Validar link do YouTube
      const videoId = extractYoutubeVideoId(currentCulto.linkyoutube);
      if (!videoId) {
        setErrorMessage("Link do YouTube inválido");
        return;
      }

      // Preparar dados do culto para envio
      const cultoData = {
        ...currentCulto
      };

      const response = await fetch(`/api/ultimos-cultos/${currentCulto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cultoData),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar Culto");
      }

      setSucessMessage("Culto atualizado com sucesso!");
      setIsEditing(false);
      resetForm();
      fetchCultos();
    } catch (error) {
      setErrorMessage("Erro ao atualizar cultos");
      console.error(error);
    }
  };

  const deleteCulto = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este Culto?")) {
      return;
    }

    setErrorMessage("");
    setSucessMessage("");

    try {
      const response = await fetch(`/api/ultimos-cultos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir Culto");
      }

      setSucessMessage("Culto excluído com sucesso!");
      fetchCultos();
    } catch (error) {
      setErrorMessage("Erro ao excluir Culto");
      console.error(error);
    }
  };

  const editCulto = (culto: CultoYoutube) => {
    setCurrentCulto(culto);
    setIsEditing(true);
    setIsCreating(false);
  };

  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  const resetForm = () => {
    setCurrentCulto({
      id: 0,
      data: "",
      hora: "",
      titulo: "",
      descricao: "",
      linkyoutube: "",
      iframe: "",
    });
  };

  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    resetForm();
  };

  // Botão para buscar dados do YouTube manualmente
  const handleFetchYouTubeData = () => {
    if (currentCulto.linkyoutube) {
      fetchYouTubeData(currentCulto.linkyoutube);
    } else {
      setErrorMessage("Por favor, insira um link do YouTube válido");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Cabeçalho com Design Moderno */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Cultos</h1>
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

        {sucessMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 flex items-center shadow-sm">
            <div className="mr-3">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span>{sucessMessage}</span>
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
              Adicionar Novo Culto
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
                  Adicionar Novo Culto
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Culto
                </>
              )}
            </h2>

            <div className="space-y-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Link do YouTube</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="linkyoutube"
                    value={currentCulto.linkyoutube}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=ojcEJ6oOvHw"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleFetchYouTubeData}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
                    disabled={isLoadingYouTubeData}
                  >
                    {isLoadingYouTubeData ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Carregando...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Buscar Dados
                      </>
                    )}
                  </button>
                </div>
                {isLoadingYouTubeData && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando dados do vídeo...
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formatDateForInput(currentCulto.data)}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    name="hora"
                    value={currentCulto.hora}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={currentCulto.titulo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  name="descricao"
                  value={currentCulto.descricao}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  rows={4}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={isCreating ? createCulto : updateCulto}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {isCreating ? "Criar Culto" : "Salvar Alterações"}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link YouTube</th>
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
                ) : cultos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum culto encontrado
                    </td>
                  </tr>
                ) : (
                  cultos.map((culto) => (
                    <tr key={culto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{culto.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(culto.data)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{culto.hora}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{culto.titulo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={culto.linkyoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                          </svg>
                          Ver vídeo
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editCulto(culto)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md transition duration-200 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => deleteCulto(culto.id)}
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