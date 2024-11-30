<template>

    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Toast />
        <h1 class="p-5 text-3xl">Поиск</h1>
        <div class="flex flex-col space-y-4 p-4 pt-10 bg-white rounded-lg shadow-md w-full max-w-md">
            <!-- Date Picker -->
            <DatePicker selectionMode="range" v-model="selectedDates" inline class="w-full sm:w-[30rem]" />

            <!-- Search by Name -->
            <div class="flex flex-col w-full">
                <span id="search-label">Поиск по наименованию</span>
                <AutoComplete v-model="searchName" inputId="search-label" :suggestions="nameSuggestions"
                    optionLabel="name" @complete="handleSearch" dropdown size="large" class="w-full" />
            </div>

            <!-- Status Selection -->
            <div class="relative">
                <span id="status-label">Состояние</span>
                <Listbox aria-labelledby="status-label" v-model="selectedStatus" :options="statusOptions" multiple
                    optionLabel="name"
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- Priority Selection -->
            <div class="relative">
                <span id="priority-label">Приоритет</span>
                <Listbox aria-labelledby="priority-label" v-model="selectedPriority" :options="priorityOptions"
                    optionLabel="name"
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- Department Selection -->
            <div class="relative">
                <span id="department-label">Департамент</span>
                <AutoComplete :disabled="!departmentOptions.length" v-model="selectedDepartment"
                    inputId="department-label" :suggestions="departmentOptions" optionLabel="name"
                    @complete="handleSearch" dropdown size="large" placeholder="Выберите департамент" class="w-full" />
            </div>

            <!-- Organizer Selection -->
            <div class="relative">
                <span id="organizer-label">Организатор</span>
                <AutoComplete :disabled="selectedDepartment.length === 0" v-model="selectedOrganizer"
                    inputId="organizer-label" :suggestions="organizerOptions" optionLabel="name"
                    @complete="handleSearchOrganizer" dropdown size="large" placeholder="Выберите организатора"
                    class="w-full" />
            </div>

            <!-- Event Type Selection -->
            <div class="relative">
                <span id="event-type-label">Средство проведения</span>
                <Listbox aria-labelledby="event-type-label" v-model="selectedEventType" :options="eventTypeOptions"
                    optionLabel="name"
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Toast, useToast } from 'primevue';
import { nextTick, ref, watch } from 'vue';
const toast = useToast()
const tg = ref(null)
const userInitialData = ref(null)
const authToken = ref('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjo1NTMsImRlcGFydG1lbnRfaWQiOjIsInBvc3QiOm51bGwsInBlcm1pc3Npb25zIjpbImdyb3VwLmNyZWF0ZSIsInVzZXIuY3JlYXRlX3B1YmxpYyIsInBlcm1hbmVudF9yb29tLmxpc3QiLCJtZWV0aW5nLmxpc3QiLCJyb2xlLmxpc3QiLCJyb29tLmxpc3QiLCJidWlsZGluZy5saXN0IiwiZ3JvdXAuZGVsZXRlIiwiZGVwYXJ0bWVudC5saXN0Iiwic3RhdGlzdGljcy5saXN0IiwiZ3JvdXAubGlzdCIsImZpbGUubGlzdCIsInNldHRpbmcubGlzdCIsImdyb3VwLnVwZGF0ZSIsImV2ZW50Lmxpc3QiLCJlbWFpbF90ZW1wbGF0ZXMubGlzdCIsIm1lZXRpbmcudXBkYXRlIiwibWVldGluZy5jcmVhdGUiLCJtZWV0aW5nLmRlbGV0ZSIsInJvbGUucGVybWlzc2lvbnNfbGlzdCIsImZpbGUuY3JlYXRlIiwidXNlci51cGRhdGVfcHVibGljIiwidXNlci5saXN0IiwibXVuaWNpcGFsX2FyZWEubGlzdCJdLCJsb2dpbiI6ImhhbnRhdG9uMTAiLCJlbWFpbCI6ImhhbnRhdG9uMTAuaEBtYWlsLnJ1IiwibGFzdF9uYW1lIjoiXHUwNDI1XHUwNDMwXHUwNDNkXHUwNDQyXHUwNDMwXHUwNDQyXHUwNDNlXHUwNDNkXHUwNDNlXHUwNDMyIiwiZmlyc3RfbmFtZSI6Ilx1MDQyNVx1MDQzMFx1MDQzZFx1MDQ0Mlx1MDQzMFx1MDQ0Mlx1MDQzZVx1MDQzZCIsIm1pZGRsZV9uYW1lIjoiIiwiYmlydGhkYXkiOm51bGwsInBob25lIjpudWxsLCJ1cGRhdGVkX2F0IjoxNzMyOTQ4NDU4LjAsInByaW9yaXR5IjoyLCJyb2xlcyI6W3sibmFtZSI6Ilx1MDQxZVx1MDQ0MFx1MDQzM1x1MDQzMFx1MDQzZFx1MDQzOFx1MDQzN1x1MDQzMFx1MDQ0Mlx1MDQzZVx1MDQ0MCIsImRlc2NyaXB0aW9uIjoiXHUwNDFlXHUwNDQwXHUwNDMzXHUwNDMwXHUwNDNkXHUwNDM4XHUwNDM3XHUwNDMwXHUwNDQyXHUwNDNlXHUwNDQwIFx1MDQzMlx1MDQzOFx1MDQzNFx1MDQzNVx1MDQzZVx1MDQzYVx1MDQzZVx1MDQzZFx1MDQ0NFx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzZFx1MDQ0Nlx1MDQzOFx1MDQzOSIsImlkIjozLCJwZXJtaXNzaW9ucyI6WyJidWlsZGluZy5saXN0IiwiZGVwYXJ0bWVudC5saXN0IiwiZW1haWxfdGVtcGxhdGVzLmxpc3QiLCJldmVudC5saXN0IiwiZmlsZS5saXN0IiwibWVldGluZy5jcmVhdGUiLCJtZWV0aW5nLmRlbGV0ZSIsIm1lZXRpbmcubGlzdCIsIm1lZXRpbmcudXBkYXRlIiwibXVuaWNpcGFsX2FyZWEubGlzdCIsInJvbGUubGlzdCIsInJvbGUucGVybWlzc2lvbnNfbGlzdCIsInJvb20ubGlzdCIsInNldHRpbmcubGlzdCIsInVzZXIubGlzdCIsInN0YXRpc3RpY3MubGlzdCIsImZpbGUuY3JlYXRlIiwicGVybWFuZW50X3Jvb20ubGlzdCIsImdyb3VwLmxpc3QiLCJncm91cC5jcmVhdGUiLCJncm91cC51cGRhdGUiLCJncm91cC5kZWxldGUiLCJwZXJtYW5lbnRfcm9vbS5saXN0IiwidXNlci5jcmVhdGVfcHVibGljIiwidXNlci51cGRhdGVfcHVibGljIl19XX0sInRva2VuX2V4cGlyZWRfYXQiOjE3MzMwMTIwMTkuMCwidG9rZW5fY3JlYXRlZF9hdCI6MTczMjk5NzYxOS4wLCJyZWZyZXNoX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SjFjMlZ5WDJsa0lqbzFOVE1zSW1WNGNDSTZNVGN6TXpVMU56Z3pOQzR3TENKMWNHUWlPakUzTXpJNU5EZzBOVGd1TUN3aWRIbHdJam9pY21WbWNtVnphQ0o5LmE3LWJaYzZ2XzJlTDYtUWNUQmZEbnVPRHhpQlBIdUI5VTF4bWFEX2Y2MWMifQ.ZXIm5tzOhB7x8oQdE33-Aq_ty3V6RzmEXszn4iFiOR8');
nextTick(() => {
     try {
        tg = window.Telegram.WebApp;
        userInitialData = tg.initData;
        tg.MainButton.setText("Поиск")
        tg.MainButton.onClick(formatRequestData)
        tg.MainButton.show()
     } catch (error) {
        console.log('Пользователь не из телеграмма')
     }


})

// Переменные для данных формы
const searchName = ref({});
const selectedOrganizer = ref({});
const selectedDepartment = ref({});
const selectedStatus = ref([]);
const selectedPriority = ref(null);
const selectedEventType = ref(null);
const nameSuggestions = ref([]);
const departmentOptions = ref([]);
const organizerOptions = ref([]);
const selectedDates = ref([]);

// Статусные данные
const statusOptions = ref([
    { name: 'Забронировано', code: 'booked' },
    { name: 'Начата', code: 'started' },
    { name: 'Отменена', code: 'cancelled' },
    { name: 'Закончена', code: 'ended' },
]);

// Таблица приоритетов
const priorityOptions = ref([
    { name: 'Высокий', code: 1 },
    { name: 'Средний', code: 2 },
    { name: 'Низкий', code: 3 },
]);

// Таблица средств проведения
const eventTypeOptions = ref([
    { name: 'Vinteo', code: 'vinteo' },
    { name: 'Cisco', code: 'cisco' },
    { name: 'Постоянная комната', code: 'permanentroom' },
    { name: 'Внешняя платформа', code: 'external' },
]);

// Состояние для отслеживания изменений
const previousSearchParams = ref({
    searchName: '',
    selectedStatus: [],
    selectedPriority: null,
    selectedDepartment: null,
    selectedOrganizer: null,
    selectedEventType: null,
});

// Сохраняем предыдущие значения, чтобы отслеживать изменения
const isParamsChanged = () => {
    return (
        previousSearchParams.value.searchName !== searchName.value ||
        JSON.stringify(previousSearchParams.value.selectedStatus) !== JSON.stringify(selectedStatus.value) ||
        previousSearchParams.value.selectedPriority !== selectedPriority.value ||
        previousSearchParams.value.selectedDepartment !== selectedDepartment.value ||
        previousSearchParams.value.selectedOrganizer !== selectedOrganizer.value ||
        previousSearchParams.value.selectedEventType !== selectedEventType.value
    );
};

// Сохраняем текущие значения в previousSearchParams
const updatePreviousParams = () => {
    previousSearchParams.value = {
        searchName: searchName.value,
        selectedStatus: [...selectedStatus.value],
        selectedPriority: selectedPriority.value,
        selectedDepartment: selectedDepartment.value,
        selectedOrganizer: selectedOrganizer.value,
        selectedEventType: selectedEventType.value
    };
};

// Поиск по имени
const handleSearch = async () => {
    if (isParamsChanged()) {
        updatePreviousParams(); // Обновляем предыдущие параметры
        const url = buildApiUrl({
            filter: searchName.value,
            state: selectedStatus.value.map(item => item.code),
            department_id: selectedDepartment.value.id,
            priority: selectedPriority ? selectedPriority.code : null,
            organizedBy: selectedOrganizer.value ? selectedOrganizer.value.id : null,
            eventType: selectedEventType ? selectedEventType.code : null,
        });
        const response = await fetch(url, {
            "headers": {
                "authorization": authToken.value,
            },
        });
        const result = await response.json();
        nameSuggestions.value = result.data;
        await fetchDepartmentOptions();
    }
};

// Поиск организаторов по департаменту
const handleSearchOrganizer = async () => {
    if (isParamsChanged()) {
        updatePreviousParams(); // Обновляем предыдущие параметры
        const response = await fetch(`https://test.vcc.uriit.ru/api/meetings/participants?page=1&rowsNumber=0&showDeleted=false&department_id=${selectedDepartment.value.id}`, {
            "headers": {
                "authorization": authToken.value,
            },
            "method": "GET"
        });
        const result = await response.json();
        organizerOptions.value = result.data.map(item => formatFullName(item));
    }
};

// Форматирование полного имени организатора
const formatFullName = (item) => ({ id: item.id, name: `${item.firstName} ${item.lastName} ${item.middleName}` });

// Загрузка департаментов
async function fetchDepartmentOptions() {
    const response = await fetch("https://test.vcc.uriit.ru/api/catalogs/buildings?page=1&rowsNumber=0&showDeleted=false", {
        "headers": {
            "authorization": authToken.value
        }
    });
    const result = await response.json();
    departmentOptions.value = result.data;
}

// Постоянный запрос на обновление данных
watch([searchName, selectedStatus, selectedPriority, selectedDepartment, selectedOrganizer, selectedEventType], async () => {
    if (isParamsChanged()) {
        await handleSearch(); // Если параметры изменились, запрашиваем данные
    }
}, { deep: true });

// Формирование URL для API-запросов
function buildApiUrl(params) {
    const baseUrl = "https://test.vcc.uriit.ru/api/meetings?page=1&rowsNumber=0&rowsPerPage=101&showDeleted=false";
    const url = new URL(baseUrl);

    // Устанавливаем текущую дату для фильтра, если она не задана
    if (!params.fromDatetime) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        params.fromDatetime = today.toISOString().split('Z')[0];
    }

    // Устанавливаем дату окончания на 7 дней вперед, если она не задана
    if (!params.toDatetime) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        futureDate.setHours(0, 0, 0, 0);
        params.toDatetime = futureDate.toISOString().split('Z')[0];
    }
    if (!params.filter) {
        params.filter = " "
    }
    const queryParams = [
        'page', 'rowsNumber', 'showDeleted', 'sortBy', 'filter', 'state',
        'fromDatetime', 'toDatetime', 'priority', 'buildingId', 'roomId',
        'departmentId', 'organizedBy', 'backend'
    ];

    queryParams.forEach(param => {
        if (params[param] !== undefined) {
            if (Array.isArray(params[param])) {
                params[param].forEach(value => url.searchParams.append(param, value));
            } else {
                url.searchParams.append(param, params[param]);
            }
        }
    });

    return url.toString();
}


function formatRequestData() {
    if (searchName.value === "" || Object.keys(searchName.value).length === 0) {
        toast.add({ severity: 'error', summary: 'Не заполненное поле', detail: 'Поле "Поиск по наименованию" объязательно!', life: 3000 })
        return
    }

    
    const requestData = {
        from_datetime: selectedDates.value.length >= 1 ? selectedDates.value[0].toISOString() : null,
        to_datetime: selectedDates.value.length === 2 && selectedDates.value[1] !== null ? selectedDates.value[1].toISOString() : null,
        filter: searchName.value.length !== null ? typeof searchName.value === 'string' ? searchName.value : searchName.value.name : "",
        priority: selectedPriority.value ? selectedPriority.value.code : null,
        department_id: selectedDepartment.value ? selectedDepartment.value.id : null,
        backend: selectedEventType.value ? selectedEventType.value.code : null,
        user_participant: 0,
        state: selectedStatus.value.length > 0 ? selectedStatus.value.map(item => item.code) : [selectedStatus.value],  // Состояния (массив кодов)
        page: 1,
    };
    
   if(userInitialData.value !== null) {
    toast.add({ severity: 'info', summary: 'Вы вошли с телеграмма', detail: 'Поздравляю!', life: 3000 })
   }

}

</script>

<style scoped>
#search-label,
#status-label,
#priority-label,
#department-label,
#organizer-label,
#event-type-label {
    width: 100%;
}
</style>
