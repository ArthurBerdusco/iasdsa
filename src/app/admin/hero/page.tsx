"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface for Culto data
interface Culto {
  id: number;
  titulo: string;
  diaSemana: string;
  data: string;
  hora: string;
  orador: string;
  imagem: string;
  oradorImagem: string;
  corDestaque: string;
}

export default function CultosAdmin() {
  const router = useRouter();
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  // Form state
  const [currentCulto, setCurrentCulto] = useState<Culto>({
    id: 0,
    titulo: "",
    diaSemana: "",
    data: "",
    hora: "",
    orador: "",
    imagem: "",
    oradorImagem: "",
    corDestaque: "primary",
  });

  // Image upload states
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [oradorImage, setOradorImage] = useState<File | null>(null);

  useEffect(() => {
    fetchCultos();
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentCulto({ ...currentCulto, [name]: value });
  };

  const handleBannerImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage(e.target.files[0]);
    }
  };

  const handleOradorImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOradorImage(e.target.files[0]);
    }
  };

  const createCulto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add culto data
      Object.entries(currentCulto).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      // Add images if selected
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }
      
      if (oradorImage) {
        formData.append("oradorImage", oradorImage);
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

  const updateCulto = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSucessMessage("");
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add culto data
      Object.entries(currentCulto).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      // Add images if selected
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }
      
      if (oradorImage) {
        formData.append("oradorImage", oradorImage);
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
      diaSemana: "",
      data: "",
      hora: "",
      orador: "",
      imagem: "",
      oradorImagem: "",
      corDestaque: "primary",
    });
    setBannerImage(null);
    setOradorImage(null);
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
                  name="diaSemana"
                  value={currentCulto.diaSemana}
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
                <input
                  type="text"
                  name="orador"
                  value={currentCulto.orador}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Cor de Destaque</label>
                <select
                  name="corDestaque"
                  value={currentCulto.corDestaque}
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
                <label className="block mb-1">Imagem do Banner</label>
                <input
                  type="file"
                  onChange={handleBannerImageChange}
                  className="w-full border rounded px-3 py-2"
                  accept="image/*"
                />
                {currentCulto.imagem && !bannerImage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Imagem atual: {currentCulto.imagem}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block mb-1">Imagem do Orador</label>
                <input
                  type="file"
                  onChange={handleOradorImageChange}
                  className="w-full border rounded px-3 py-2"
                  accept="image/*"
                />
                {currentCulto.oradorImagem && !oradorImage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Imagem atual: {currentCulto.oradorImagem}
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
              <th className="border px-4 py-2">Orador</th>
              <th className="border px-4 py-2">Banner</th>
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
                  <td className="border px-4 py-2">{culto.diaSemana}</td>
                  <td className="border px-4 py-2">{culto.data}</td>
                  <td className="border px-4 py-2">{culto.hora}</td>
                  <td className="border px-4 py-2">{culto.orador}</td>
                  <td className="border px-4 py-2">
                    {culto.imagem && (
                      <div className="relative h-16 w-16">
                        <Image
                          src={culto.imagem}
                          alt="Banner"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {culto.oradorImagem && (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={culto.oradorImagem}
                          alt="Orador"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`inline-block w-6 h-6 rounded-full bg-${culto.corDestaque}-500`}
                    />
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