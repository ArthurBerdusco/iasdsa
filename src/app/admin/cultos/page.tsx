"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Culto } from "@/types/cultos";
import { Orador } from "@/types/oradores";
import { formatDateForDisplay, formatDateForInput } from "@/utils/formatoData";

export default function CultosAdmin() {
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [oradores, setOradores] = useState<Orador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  // Form state
  const [currentCulto, setCurrentCulto] = useState<Culto>({
    id: 0,
    titulo: "",
    diasemana: "",
    data: "",
    hora: "",
    orador: {
      id: 0,
      nome: "",
      foto: "",
    },
    arte: "",
    cordestaque: "primary",
  });

  // Image upload states
  const [arte, setArte] = useState<File | null>(null);

  useEffect(() => {
    fetchCultos();
    fetchOradores();
  }, []);

  const fetchCultos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cultos");
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

  const fetchOradores = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/oradores");
      if (!response.ok) {
        throw new Error("Falha ao carregador oradores");
      }

      const data = await response.json();
      setOradores(data);
    } catch (error) {
      setErrorMessage("Erro ao carregar oradores");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentCulto({ ...currentCulto, [name]: value });
  };

  const handleArteChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArte(e.target.files[0]);
    }
  };

  const createCulto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Adicionar dados do culto, mas tratando o orador corretamente
      formData.append("titulo", currentCulto.titulo);
      formData.append("diasemana", currentCulto.diasemana);
      formData.append("data", currentCulto.data);
      formData.append("hora", currentCulto.hora);
      formData.append("oradorId", String(currentCulto.orador.id)); // Enviar apenas o ID do orador
      formData.append("cordestaque", currentCulto.cordestaque);

      // Adicionar imagem se selecionada
      if (arte) {
        formData.append("arte", arte);
      }

      const response = await fetch("/api/cultos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao criar culto");
      }

      setSucessMessage("Culto criado com sucesso!");
      setIsCreating(false);
      resetForm();
      fetchCultos();
    } catch (error) {
      setErrorMessage("Erro ao criar culto");
      console.error(error);
    }
  };

  // Versão corrigida para updateCulto
  const updateCulto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Adicionar dados do culto, mas tratando o orador corretamente
      formData.append("id", String(currentCulto.id));
      formData.append("titulo", currentCulto.titulo);
      formData.append("diasemana", currentCulto.diasemana);
      formData.append("data", currentCulto.data);
      formData.append("hora", currentCulto.hora);
      formData.append("oradorId", String(currentCulto.orador.id)); // Enviar apenas o ID do orador
      formData.append("cordestaque", currentCulto.cordestaque);

      // Adicionar imagem se selecionada
      if (arte) {
        formData.append("arte", arte);
      }

      const response = await fetch(`/api/cultos/${currentCulto.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar culto");
      }

      setSucessMessage("Culto atualizado com sucesso!");
      setIsEditing(false);
      resetForm();
      fetchCultos();
    } catch (error) {
      setErrorMessage("Erro ao atualizar culto");
      console.error(error);
    }
  };

  // Função adicional para melhorar a seleção de oradores no formulário
  const handleOradorChange = (oradorId: number) => {
    const selectedOrador = oradores.find(orador => orador.id === oradorId);
    if (selectedOrador) {
      setCurrentCulto({
        ...currentCulto,
        orador: selectedOrador
      });
    }
  };

  const deleteCulto = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este culto?")) {
      return;
    }

    setErrorMessage("");
    setSucessMessage("");

    try {
      const response = await fetch(`/api/cultos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir culto");
      }

      setSucessMessage("Culto excluído com sucesso!");
      fetchCultos();
    } catch (error) {
      setErrorMessage("Erro ao excluir culto");
      console.error(error);
    }
  };

  const editCulto = (culto: Culto) => {
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
      titulo: "",
      diasemana: "",
      data: "",
      hora: "",
      orador: {
        id: 0,
        nome: "",
        foto: ""
      },
      arte: "",
      cordestaque: "",
    });
    setArte(null);
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

          <form onSubmit={isCreating ? createCulto : updateCulto} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Dia da Semana</label>
                <select
                  name="diasemana"
                  value={currentCulto.diasemana}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="DOMINGO">DOMINGO</option>
                  <option value="SEGUNDA">SEGUNDA</option>
                  <option value="TERÇA">TERÇA</option>
                  <option value="QUARTA">QUARTA</option>
                  <option value="QUINTA">QUINTA</option>
                  <option value="SEXTA">SEXTA</option>
                  <option value="SÁBADO">SÁBADO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data (DD/MM/AAAA)</label>
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
                  type="text"
                  name="hora"
                  value={currentCulto.hora}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="19h30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orador</label>
                <select
                  name="orador"
                  value={currentCulto.orador.id}
                  onChange={(e) => handleOradorChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                >
                  <option value="">Selecione um orador</option>
                  {oradores.map((orador) => (
                    <option key={orador.id} value={orador.id}>
                      {orador.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Destaque</label>
                <select
                  name="cordestaque"
                  value={currentCulto.cordestaque}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="accent">Accent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arte do Culto</label>
                <input
                  type="file"
                  onChange={handleArteChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                  accept="image/*"
                />
                {currentCulto.arte && !arte && (
                  <div className="mt-3 flex items-center">
                    <div className="relative h-32 w-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image
                        src={currentCulto.arte}
                        alt="Arte do culto"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Arte atual</p>
                      <p className="text-xs text-gray-500 mt-1">{currentCulto.arte.split('/').pop()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {isCreating ? "Criar Culto" : "Salvar Alterações"}
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

      {/* Tabela com Design Aprimorado */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
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
              ) : cultos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum culto encontrado
                  </td>
                </tr>
              ) : (
                cultos.map((culto) => (
                  <tr key={culto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{culto.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{culto.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{culto.diasemana}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(culto.data)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{culto.hora}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {culto.arte && (
                        <div className="h-16 w-24 rounded-md overflow-hidden border border-gray-200 bg-gray-50 relative">
                          <Image
                            src={culto.arte}
                            alt={culto.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{culto.orador.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {culto.orador && (
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={culto.orador.foto}
                            alt="Orador"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        culto.cordestaque === "primary" ? "bg-blue-100 text-blue-800" : 
                        culto.cordestaque === "secondary" ? "bg-purple-100 text-purple-800" : 
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {culto.cordestaque}
                      </span>
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