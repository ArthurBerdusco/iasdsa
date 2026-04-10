"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Anuncio, AnuncioLink, TipoLink } from "@/types/anuncios";
import { formatDateForDisplay } from "@/utils/formatoData";

export default function AnunciosAdmin() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [arte, setArte] = useState<File | null>(null);
  const [linksList, setLinksList] = useState<AnuncioLink[]>([]);

  // Estado inicial para um novo anúncio
  const emptyAnuncio: Anuncio = {
    id: 0,
    titulo: "",
    texto: "",
    arte: "",
    dataEvento: "",
    ativo: true,
    destaque: false,
    links: []
  };

  // Form state
  const [currentAnuncio, setCurrentAnuncio] = useState<Anuncio>(emptyAnuncio);

  // Estado para um novo link
  const [newLink, setNewLink] = useState<Partial<AnuncioLink>>({
    tipo_link: TipoLink.WEBSITE,
    url: "",
    textoBotao: ""
  });

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/anuncios");
      if (!response.ok) {
        throw new Error("Falha ao carregar anúncios");
      }
      const data = await response.json();
      setAnuncios(data);
    } catch (error) {
      setErrorMessage("Erro ao carregar anúncios");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentAnuncio({ ...currentAnuncio, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentAnuncio({ ...currentAnuncio, [name]: checked });
  };

  const handlearteChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArte(e.target.files[0]);
      console.log("arte selecionada:", e.target.files[0].name);
    }
  };

  const handleLinkInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLink({ ...newLink, [name]: value });
  };

  const addLink = () => {
    if (newLink.url && newLink.tipo_link) {
      const newLinkWithId = {
        ...newLink,
        id: Date.now(), // Usar timestamp como ID temporário
        tipo_link: newLink.tipo_link as TipoLink,
        url: newLink.url
      } as AnuncioLink;

      setLinksList([...linksList, newLinkWithId]);
      setCurrentAnuncio({
        ...currentAnuncio,
        links: [...linksList, newLinkWithId]
      });

      // Reset link form
      setNewLink({
        tipo_link: TipoLink.WEBSITE,
        url: "",
        textoBotao: ""
      });
    }
  };

  const removeLink = (id: number) => {
    const updatedLinks = linksList.filter(link => link.id !== id);
    setLinksList(updatedLinks);
    setCurrentAnuncio({
      ...currentAnuncio,
      links: updatedLinks
    });
  };

  const createAnuncio = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add Anuncio data
      formData.append("titulo", currentAnuncio.titulo);
      formData.append("texto", currentAnuncio.texto);
      formData.append("dataEvento", currentAnuncio.dataEvento);
      formData.append("ativo", String(currentAnuncio.ativo));
      formData.append("destaque", String(currentAnuncio.destaque));
      formData.append("links", JSON.stringify(currentAnuncio.links));

      if (arte) {
        formData.append("arte", arte);
      }

      const response = await fetch("/api/anuncios", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao criar anúncio");
      }

      setSuccessMessage("Anúncio criado com sucesso!");
      setIsCreating(false);
      resetForm();
      fetchAnuncios();
    } catch (error) {
      setErrorMessage("Erro ao criar anúncio");
      console.error(error);
    }
  };

  const updateAnuncio = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add Anuncio data
      formData.append("id", String(currentAnuncio.id));
      formData.append("titulo", currentAnuncio.titulo);
      formData.append("texto", currentAnuncio.texto);
      formData.append("dataEvento", currentAnuncio.dataEvento);
      formData.append("ativo", String(currentAnuncio.ativo));
      formData.append("destaque", String(currentAnuncio.destaque));
      formData.append("links", JSON.stringify(currentAnuncio.links));

      if (arte) {
        formData.append("arte", arte);
      }

      const response = await fetch(`/api/anuncios/${currentAnuncio.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar anúncio");
      }

      setSuccessMessage("Anúncio atualizado com sucesso!");
      setIsEditing(false);
      resetForm();
      fetchAnuncios();
    } catch (error) {
      setErrorMessage("Erro ao atualizar anúncio");
      console.error(error);
    }
  };

  const deleteAnuncio = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/anuncios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir anúncio");
      }

      setSuccessMessage("Anúncio excluído com sucesso!");
      fetchAnuncios();
    } catch (error) {
      setErrorMessage("Erro ao excluir anúncio");
      console.error(error);
    }
  };

  const editAnuncio = (anuncio: Anuncio) => {
    const anuncioForm: Anuncio = {
      id: anuncio.id,
      titulo: anuncio.titulo,
      texto: anuncio.texto,
      arte: anuncio.arte,
      dataEvento: anuncio.dataEvento,
      ativo: anuncio.ativo,
      destaque: anuncio.destaque,
      links: anuncio.links || []
    };

    setCurrentAnuncio(anuncioForm);
    setLinksList(anuncio.links || []);
    setIsEditing(true);
    setIsCreating(false);
  };

  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  const resetForm = () => {
    setCurrentAnuncio(emptyAnuncio);
    setLinksList([]);
    setArte(null);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    resetForm();
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Renderiza um link para exibição com design melhorado
  const renderLink = (link: AnuncioLink) => {
    return (
      <div key={link.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm">
        <span className="font-medium text-gray-700">{link.tipo_link}</span>
        <span className="text-sm truncate flex-1 text-gray-600">{link.url}</span>
        {link.textoBotao && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
            {link.textoBotao}
          </span>
        )}
        <button
          type="button"
          onClick={() => removeLink(link.id)}
          className="text-red-500 hover:text-red-700 flex items-center"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Cabeçalho com Design Moderno */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Anúncios</h1>
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
              Adicionar Novo Anúncio
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
                  Adicionar Novo Anúncio
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Anúncio
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
                    value={currentAnuncio.titulo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data do Evento</label>
                  <input
                    type="date"
                    name="dataEvento"
                    value={currentAnuncio.dataEvento}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
                <textarea
                  name="texto"
                  value={currentAnuncio.texto}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arte do Anúncio</label>
                <input
                  type="file"
                  onChange={handlearteChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                  accept="image/*"
                />
                {currentAnuncio.arte && !arte && (
                  <div className="mt-3 flex items-center">
                    <div className="relative h-32 w-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image
                        unoptimized  
                        src={currentAnuncio.arte}
                        alt="Arte do anúncio"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Arte atual</p>
                      <p className="text-xs text-gray-500 mt-1">{currentAnuncio.arte.split('/').pop()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="destaque"
                    name="destaque"
                    checked={currentAnuncio.destaque}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label htmlFor="destaque" className="ml-2 text-sm font-medium text-gray-700">
                    Destaque
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    name="ativo"
                    checked={currentAnuncio.ativo}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-700">
                    Anúncio Ativo
                  </label>
                </div>
              </div>

              {/* Seção de Links */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Links
                </h3>

                <div className="space-y-3 mb-6">
                  {linksList.length > 0 ? (
                    linksList.map(link => renderLink(link))
                  ) : (
                    <p className="text-gray-500 italic text-sm py-2">Nenhum link adicionado</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Adicionar novo link</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                      <select
                        name="tipo_link"
                        value={newLink.tipo_link}
                        onChange={handleLinkInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      >
                        {Object.values(TipoLink).map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                      <input
                        type="text"
                        name="url"
                        value={newLink.url}
                        onChange={handleLinkInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Texto do Botão (opcional)</label>
                      <input
                        type="text"
                        name="textoBotao"
                        value={newLink.textoBotao}
                        onChange={handleLinkInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Clique aqui"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={addLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition duration-200 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar Link
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={isCreating ? createAnuncio : updateAnuncio}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {isCreating ? "Criar Anúncio" : "Salvar Alterações"}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Evento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arte</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destaque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Carregando...
                      </div>
                    </td>
                  </tr>
                ) : anuncios.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum anúncio encontrado
                    </td>
                  </tr>
                ) : (
                  anuncios.map((anuncio) => (
                    <tr key={anuncio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{anuncio.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{anuncio.titulo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateForDisplay(anuncio.dataEvento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {anuncio.arte && (
                          <div className="h-16 w-24 rounded-md overflow-hidden border border-gray-200 bg-gray-50 relative">
                            <Image
                              unoptimized  
                              src={anuncio.arte}
                              alt={anuncio.titulo}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${anuncio.destaque ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {anuncio.destaque ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${anuncio.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {anuncio.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {anuncio.links && anuncio.links.map((link, index) => (
                            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                              {link.tipo_link}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editAnuncio(anuncio)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md transition duration-200 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => deleteAnuncio(anuncio.id)}
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