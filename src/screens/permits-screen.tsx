import { LoadingScreen } from "./loading-screen";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { KvkkResponse, getKvkkPermit, setKvkkPermit } from "@/api/kvkk";
import { LoadingWrapper } from "@/components/loading-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { Switch } from "@/components/ui/switch";
import { useGrispi } from "@/contexts/grispi-context";
import { convertPhoneNumber } from "@/lib/utils";

export const PermitsScreen = observer(() => {
  const { loading, bundle } = useGrispi();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [kvkkData, setKvkkData] = useState<KvkkResponse["cari"] | null>(null);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");

  const requesterPhoneNumber = bundle?.context.requester.phone;

  useEffect(() => {
    if (requesterPhoneNumber) {
      setPhoneNumber(requesterPhoneNumber);
      fetchKvkkData(requesterPhoneNumber);
    }
  }, [requesterPhoneNumber]);

  const fetchKvkkData = async (phone: string) => {
    if (!bundle?.context.token) return;

    const formattedPhone = convertPhoneNumber(phone);

    if (!formattedPhone) {
      toast.error("Geçersiz telefon numarası");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getKvkkPermit(formattedPhone);

      if (response.status === false) {
        setKvkkData(null);
        setShowNewForm(true);
        return;
      }

      setKvkkData(response.cari);
      setIsPermitted(response.cari.kvkkOnayi === 1);
      setShowNewForm(false);
    } catch (error) {
      console.error("KVKK verisi alınamadı:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermitChange = async (checked: boolean) => {
    if (!bundle?.context.token || !kvkkData) return;
    setIsLoading(true);
    try {
      const response = await setKvkkPermit({
        ...kvkkData,
        kvkkOnayi: checked ? 1 : 0,
      });
      setKvkkData(response.cari);
      setIsPermitted(response.cari.kvkkOnayi === 1);
    } catch (error) {
      console.error("KVKK izni güncellenemedi:", error);
    }
    setIsLoading(false);
  };

  const handleCreateNewPermit = async () => {
    if (!bundle?.context.token) return;

    const formattedPhone = convertPhoneNumber(phoneNumber);
    if (!formattedPhone) {
      toast.error("Geçersiz telefon numarası");
      return;
    }

    if (!newFullName) {
      toast.error("Lütfen ad soyad giriniz");
      return;
    }

    setIsLoading(true);
    try {
      const response = await setKvkkPermit({
        cariIsim: newFullName,
        cariTelefon: formattedPhone,
        kvkkOnayi: isPermitted ? 1 : 0,
      });
      setKvkkData(response.cari);
      setShowNewForm(false);
      toast.success("KVKK kaydı oluşturuldu");
    } catch (error) {
      console.error("KVKK kaydı oluşturulamadı:", error);
      toast.error("KVKK kaydı oluşturulamadı");
    }
    setIsLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Screen>
      <ScreenHeader>
        <ScreenTitle>KVKK İzin Yönetimi</ScreenTitle>
      </ScreenHeader>
      <ScreenContent>
        <LoadingWrapper loading={isLoading}>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex flex-col gap-4">
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchKvkkData(phoneNumber);
                  }}
                  className="flex items-center"
                >
                  <Input
                    type="tel"
                    autoFocus
                    placeholder="Telefon Numarası"
                    value={phoneNumber}
                    className="bg-white rounded-e-none"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Button type="submit" className="rounded-s-none">Ara</Button>
                </form>
                {showNewForm && (
                  <div className="flex gap-2 items-center px-3 py-2 pt-4 -mt-2 text-xs font-medium rounded-b-lg text-destructive bg-destructive/10">
                    <ExclamationTriangleIcon className="size-3" />
                    <span>Bu numaraya ait bir kayıt yok.</span>
                  </div>
                )}
              </div>

              {showNewForm && (
                <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border">
                  <h3 className="text-sm font-semibold">
                    Yeni Cari Oluştur
                  </h3>
                  <Input
                    type="text"
                    placeholder="Ad Soyad"
                    value={newFullName}
                    className="bg-white"
                    onChange={(e) => setNewFullName(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs">KVKK İzni</span>
                    <Switch
                      checked={isPermitted}
                      onCheckedChange={setIsPermitted}
                    />
                  </div>
                  <Button onClick={handleCreateNewPermit}>Kaydet</Button>
                </div>
              )}

              {kvkkData && (
                <div className="flex flex-col divide-y *:py-2 *:text-xs">
                  <div className="flex justify-between items-center">
                    <span>Müşteri Kodu</span>
                    <span className="font-bold">{kvkkData.cariKodu}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Müşteri Adı</span>
                    <span className="font-bold">{kvkkData.cariIsim}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Telefon</span>
                    <span className="font-bold">{kvkkData.cariTelefon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>KVKK İzni</span>
                    <Switch
                      checked={isPermitted}
                      onCheckedChange={handlePermitChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </LoadingWrapper>
      </ScreenContent>
    </Screen>
  );
});
