"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Orador } from "@/types/oradores";


export default function OradoresAdmin() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };


  const router = useRouter();
  const [oradores, setOradores] = useState<Orador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  // Form state
  const [currentOrador, setCurrentOrador] = useState<Orador>({
    id: 0,
    nome: "",
    foto: "",
  });

  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    fetchOradores();
  }, []);

  const fetchOradores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/oradores");
      if (!response.ok) {
        throw new Error("Falha ao carregar oradores");
      }
      const data = await response.json();
      setOradores(data);
    } catch (error) {
      setErrorMessage("Erro ao carregar oradores");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentOrador({ ...currentOrador, [name]: value });
  };



  // Fix for the handleFotoChange function
  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Store the file in state
      setFoto(e.target.files[0]);

      // Don't use an alert here as it may show before state updates
      console.log("File selected:", e.target.files[0].name);
    }
  };


  const createOrador = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();


      formData.append("nome", currentOrador.nome);


      if (foto) {
        formData.append("foto", foto);
      }

      const response = await fetch("/api/oradores", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao criar orador");
      }

      setSucessMessage("Orador criado com sucesso!");
      setIsCreating(false);
      resetForm();
      fetchOradores();
    } catch (error) {
      setErrorMessage("Erro ao criar orador");
      console.error(error);
    }
  };

  const updateOrador = async (e: FormEvent) => {

      e.preventDefault();
      setErrorMessage("");
      setSucessMessage("");

      try {
        // Create FormData to handle file uploads
        const formData = new FormData();

        formData.append("id", String(currentOrador.id));
        formData.append("nome", currentOrador.nome);

        if (foto) {
          formData.append("foto", foto);
        }

        const response = await fetch(`/api/oradores/${currentOrador.id}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Falha ao atualizar orador");
        }

        setSucessMessage("Orador atualizado com sucesso!");
        setIsEditing(false);
        resetForm();
        fetchOradores();
      } catch (error) {
        setErrorMessage("Erro ao atualizar oradores");
        console.error(error);
      }
    };

    const deleteOrador = async (id: number) => {
      if (!confirm("Tem certeza que deseja excluir este orador?")) {
        return;
      }

      setErrorMessage("");
      setSucessMessage("");

      try {
        const response = await fetch(`/api/oradores/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Falha ao excluir orador");
        }

        setSucessMessage("Orador excluído com sucesso!");
        fetchOradores();
      } catch (error) {
        setErrorMessage("Erro ao excluir orador");
        console.error(error);
      }
    };


    const editOrador = (orador: Orador) => {
      const oradorForm: Orador = {
        id: orador.id,
        nome: orador.nome,
        foto: orador.foto,
      };

      setCurrentOrador(oradorForm);
      setIsEditing(true);
      setIsCreating(false);
    };


    const startCreating = () => {
      resetForm();
      setIsCreating(true);
      setIsEditing(false);
    };

    const resetForm = () => {
      setCurrentOrador({
        id: 0,
        nome: "",
        foto: ""
      });
      setFoto(null);
    };

    const cancelForm = () => {
      setIsCreating(false);
      setIsEditing(false);
      resetForm();
    };

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          {/* Cabeçalho com Design Moderno */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Oradores</h1>
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
                Adicionar Novo Orador
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
                    Adicionar Novo Orador
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Orador
                  </>
                )}
              </h2>

              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      value={currentOrador.nome}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Orador</label>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <input
                          type="file"
                          onChange={handleFotoChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                          accept="image/*"
                        />
                      </div>
                      {currentOrador.foto && !foto && (
                        <div className="ml-3 h-14 w-14 rounded-full overflow-hidden border border-gray-200 relative">
                          <Image
                            src={currentOrador.foto}
                            alt={currentOrador.nome}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {currentOrador.foto && !foto && (
                      <p className="text-xs text-gray-500 mt-1">
                        Imagem atual: {currentOrador.foto.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={isCreating ? createOrador : updateOrador}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm"
                  >
                    {isCreating ? "Criar Orador" : "Salvar Alterações"}
                  </button>

                  <button
                    onClick={cancelForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm"
                  >
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Carregando...
                        </div>
                      </td>
                    </tr>
                  ) : oradores.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum orador encontrado
                      </td>
                    </tr>
                  ) : (
                    oradores.map((orador) => (
                      <tr key={orador.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orador.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{orador.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {orador.foto && (
                            <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 relative">
                              <Image
                                src={orador.foto}
                                alt={orador.nome}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editOrador(orador)}
                              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md transition duration-200 flex items-center"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </button>
                            <button
                              onClick={() => deleteOrador(orador.id)}
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