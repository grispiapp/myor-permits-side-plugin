export const MYOR_API_URL = "https://37.9.200.138:1002/api/cari";
export const MYOR_API_KEY =
  "ndELyqBXWZwkNq6TQpY_6EKXorusfGhMNBeq4SspiqxPwu0GpBJeaPiEbrNxw6l-";

export type KvkkPayload = {
  cariKodu?: string;
  cariIsim: string;
  cariTelefon: string;
  kvkkOnayi: number;
};

export type KvkkResponse = {
  status: true;
  cari: {
    cariKodu: string;
    cariIsim: string;
    cariTelefon: string;
    kvkkOnayi: number;
  };
};

export type KvkkErrorResponse = {
  status: false;
  description: string;
  message: string;
};

export const getKvkkPermit = async (
  phone: string
): Promise<KvkkResponse | KvkkErrorResponse> => {
  const response = await fetch(
    `${MYOR_API_URL}/${MYOR_API_KEY}/kvkk?telefon=${phone}`
  );

  if (!response.ok) {
    throw new Error("KVKK verisi alınamadı");
  }

  return response.json();
};

export const setKvkkPermit = async (
  data: KvkkPayload
): Promise<KvkkResponse> => {
  const response = await fetch(`${MYOR_API_URL}/${MYOR_API_KEY}/kvkk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("KVKK izni güncellenemedi");
  }

  return response.json();
};
