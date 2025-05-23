"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface for Culto data
interface Culto {
  id: number;
  titulo: string;
  diasemana: string;
  data: string;
  hora: string;
  orador: Orador;
  arte: string;
  cordestaque: string;
}

interface Orador {
  id: number;
  nome: string;
  foto: string;
}

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Cultos</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {sucessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {sucessMessage}
        </div>
      )}

      {!isCreating && !isEditing && (
        <div className="mb-4">
          <button
            onClick={startCreating}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Adicionar Novo Culto
          </button>
        </div>
      )}

      {(isCreating || isEditing) && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? "Adicionar Novo Culto" : "Editar Culto"}
          </h2>

          <form onSubmit={isCreating ? createCulto : updateCulto}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={currentCulto.titulo}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Dia da Semana</label>
                <select
                  name="diasemana"
                  value={currentCulto.diasemana}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
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
                <label className="block mb-1">Data (DD/MM/AAAA)</label>
                <input
                  type="text"
                  name="data"
                  value={currentCulto.data}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="01/01/2025"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Hora</label>
                <input
                  type="text"
                  name="hora"
                  value={currentCulto.hora}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="19h30"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Orador</label>
                <select
                  name="orador"
                  value={currentCulto.orador.id}
                  onChange={(e) => handleOradorChange(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
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
                <label className="block mb-1">Cor de Destaque</label>
                <select
                  name="cordestaque"
                  value={currentCulto.cordestaque}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="accent">Accent</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Arte do Culto</label>
                <input
                  type="file"
                  onChange={handleArteChange}
                  className="w-full border rounded px-3 py-2"
                  accept="image/*"
                />
                {currentCulto.arte && !arte && (
                  <p className="text-sm text-gray-500 mt-1">
                    Imagem atual: {currentCulto.arte}
                  </p>
                )}
              </div>

            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isCreating ? "Criar" : "Atualizar"}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Título</th>
              <th className="border px-4 py-2">Dia</th>
              <th className="border px-4 py-2">Data</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Arte</th>
              <th className="border px-4 py-2">Orador</th>
              <th className="border px-4 py-2">Foto Orador</th>
              <th className="border px-4 py-2">Cor</th>
              <th className="border px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="border px-4 py-2 text-center">
                  Carregando...
                </td>
              </tr>
            ) : cultos.length === 0 ? (
              <tr>
                <td colSpan={10} className="border px-4 py-2 text-center">
                  Nenhum culto encontrado
                </td>
              </tr>
            ) : (
              cultos.map((culto) => (
                <tr key={culto.id}>
                  <td className="border px-4 py-2">{culto.id}</td>
                  <td className="border px-4 py-2">{culto.titulo}</td>
                  <td className="border px-4 py-2">{culto.diasemana}</td>
                  <td className="border px-4 py-2">{culto.data}</td>
                  <td className="border px-4 py-2">{culto.hora}</td>
                  <td className="border px-4 py-2">
                    {culto.arte && (
                      <div className="relative h-16 w-16">
                        <Image
                          src={culto.arte}
                          alt="Arte"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">{culto.orador.nome}</td>
                  <td className="border px-4 py-2">
                    {culto.orador && (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={culto.orador.foto}
                          alt="Orador"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {culto.cordestaque}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editCulto(culto)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteCulto(culto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
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
  );
}