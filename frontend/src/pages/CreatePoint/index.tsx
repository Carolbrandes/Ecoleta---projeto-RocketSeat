import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './CreatePoint.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';

const CreatePoint = () => {
    // vamos criar o estado para armazenar os itemns que estao vindo da nossa api:
    // inicialmente vamos comecar com o array retornado do useState vazio
    // sempre q nos criamos um estado para um array ou objeto nos precisamos manualmente o tipo de variavel q variavel q vai se informada la dentro.

    // serve para representar um formato q um objeto vai ter
    interface Item {
        id: number;
        title: string;
        image_url: string;
    }

    interface IBGEUFResponse {
        sigla: string;
    }

    interface IBGECityResponse {
        nome: string;
    }

    // o useState vai ser um generic de array de Item.
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);


    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    // esse estado vai armazenar ql o estado que o usuario selecionou
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();


    // utilizando o useEffect essa funcao dentro dele sera disparada uma unica vez independente do numero de vezes que os componentes forem carregados.
    // 1º param - qual a funcao que eu quero executar
    // 2º param - quando eu quero executar, entao vamos passarn um array vazio e ai será disparada uma única vez.

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    }, []);


    useEffect(() => {
        api.get('items')
            .then(response => {
                setItems(response.data);
            })
    }, []);


    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUfs(ufInitials);
            })
    }, []);


    useEffect(() => {
        // carregar as cidades sempre que a uf mudar
        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
                setCities(cityNames);
            })


    }, [selectedUf]);


    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        // o ...formData vai copiar td que tem no estado formData para o objeto q estamos enviando para o setFormData
        setFormData({ ...formData, [name]: value })
    }


    function handleSelectItem(id: number) {
        // vamos verificar se o usuario ja selecionou o item
        const alreadySelected = selectedItems.findIndex(item => item === id);

        // se ja tiver no array nao retorna -1, ele vai tirar do array e se nao ele vai inserir no array
        if (alreadySelected >= 0) {
            // estamos pegando todos os id's diferente do id que eu quero remover
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            // fazendo isso: ...selectedItems estamos aproveitando as informações q ja estao no estado.
            setSelectedItems([...selectedItems, id]);
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append("name", name);
        data.append("email", email);
        data.append("whatsapp", whatsapp);
        data.append("uf", uf);
        data.append("city", city);
        data.append("latitude", String(latitude));
        data.append("longitude", String(longitude));
        data.append("items", items.join(','));
        
        if(selectedFile){
            data.append('image', selectedFile);
        }

        // vai esperar essa funcao abaixo terminar
        await api.post('points', data);
        alert("Ponto de coleta criado!");

        // depois ele vai redirecionar para a home
        history.push('/');
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coletas</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input onChange={handleInputChange} type="text" name="name" id="name" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input onChange={handleInputChange} type="email" name="email" id="email" />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input onChange={handleInputChange} type="text" name="whatsapp" id="whatsapp" />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o Endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        {/* o TileLayer é o design q vamos utilizar */}
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* marker = alfinete */}
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''} >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint;