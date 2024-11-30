<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 style="font-size: 40px;" class="p-5">Поиск</h1>
        <div class="flex flex-col space-y-4 p-4 pt-10 bg-white rounded-lg shadow-md w-full max-w-md">
            <DatePicker selectionMode="range" v-model="dates" inline class="w-full sm:w-[30rem]" />
            <div class="flex flex-col w-full">
                <span id="over_label">Поиск по наименованию</span>
                <AutoComplete v-model="NameSearch" inputId="over_label" :suggestions="NameItems" optionLabel="name"
                    @complete="search" dropdown size="large"
                    class="w-full " />
            </div>

            <div class="relative" variant="over">
                <span id="lb">Состояние</span>
                <Listbox aria-labelledby="lb" v-model="StatusSelect" :options="StatusItems" multiple optionLabel="name"
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="relative" variant="over">
                <span id="lb">Приоритет</span>
                <Listbox aria-labelledby="lb"  :options="['Высокий' , 'Средний' ,'Низкий']" 
                    class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="relative" variant="over">
                <span id="lb">Депортамент</span>
                <AutoComplete :disabled="!DeportamentItems.length" v-model="DeportamentSelect" inputId="over_label1"  :suggestions="DeportamentItems" optionLabel="name"
                    @complete="search" dropdown size="large" placeholder="Выберите депортамент"
                    class="w-full " />
            </div>
            <div class="relative" variant="over">
                <span id="lb">Организатор</span>
                <AutoComplete :disabled="!DeportamentSelect" v-model="OrganizersSelect" inputId="over_label1"  :suggestions="OrganizersItems" optionLabel="name"
                    @complete="search" dropdown size="large" placeholder="Выберите организатора"
                    class="w-full " />
            </div>
            <div class="relative" variant="over">
                <span id="lb">Средство проведения</span>
                <AutoComplete :disabled="!OrganizersSelect" v-model="OrganizersSelect" inputId="over_label1"  :suggestions="['  ']" optionLabel="name"
                    @complete="search" dropdown size="large" placeholder="Выберите организатора"
                    class="w-full " />
            </div>
            
        </div>
    </div>
</template>

<script setup>

import { nextTick, ref } from 'vue'
const jwt = ref('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjo1NTMsImRlcGFydG1lbnRfaWQiOjIsInBvc3QiOm51bGwsInBlcm1pc3Npb25zIjpbImV2ZW50Lmxpc3QiLCJyb29tLmxpc3QiLCJlbWFpbF90ZW1wbGF0ZXMubGlzdCIsInVzZXIubGlzdCIsImZpbGUuY3JlYXRlIiwibWVldGluZy5kZWxldGUiLCJwZXJtYW5lbnRfcm9vbS5saXN0IiwiYnVpbGRpbmcubGlzdCIsImdyb3VwLmxpc3QiLCJyb2xlLmxpc3QiLCJzdGF0aXN0aWNzLmxpc3QiLCJkZXBhcnRtZW50Lmxpc3QiLCJmaWxlLmxpc3QiLCJtZWV0aW5nLmNyZWF0ZSIsInNldHRpbmcubGlzdCIsInVzZXIudXBkYXRlX3B1YmxpYyIsImdyb3VwLmNyZWF0ZSIsIm11bmljaXBhbF9hcmVhLmxpc3QiLCJyb2xlLnBlcm1pc3Npb25zX2xpc3QiLCJncm91cC5kZWxldGUiLCJ1c2VyLmNyZWF0ZV9wdWJsaWMiLCJtZWV0aW5nLnVwZGF0ZSIsImdyb3VwLnVwZGF0ZSIsIm1lZXRpbmcubGlzdCJdLCJsb2dpbiI6ImhhbnRhdG9uMTAiLCJlbWFpbCI6ImhhbnRhdG9uMTAuaEBtYWlsLnJ1IiwibGFzdF9uYW1lIjoiXHUwNDI1XHUwNDMwXHUwNDNkXHUwNDQyXHUwNDMwXHUwNDQyXHUwNDNlXHUwNDNkXHUwNDNlXHUwNDMyIiwiZmlyc3RfbmFtZSI6Ilx1MDQyNVx1MDQzMFx1MDQzZFx1MDQ0Mlx1MDQzMFx1MDQ0Mlx1MDQzZVx1MDQzZCIsIm1pZGRsZV9uYW1lIjoiIiwiYmlydGhkYXkiOm51bGwsInBob25lIjpudWxsLCJ1cGRhdGVkX2F0IjoxNzMyOTQ4NDU4LjAsInByaW9yaXR5IjoyLCJyb2xlcyI6W3sibmFtZSI6Ilx1MDQxZVx1MDQ0MFx1MDQzM1x1MDQzMFx1MDQzZFx1MDQzOFx1MDQzN1x1MDQzMFx1MDQ0Mlx1MDQzZVx1MDQ0MCIsImRlc2NyaXB0aW9uIjoiXHUwNDFlXHUwNDQwXHUwNDMzXHUwNDMwXHUwNDNkXHUwNDM4XHUwNDM3XHUwNDMwXHUwNDQyXHUwNDNlXHUwNDQwIFx1MDQzMlx1MDQzOFx1MDQzNFx1MDQzNVx1MDQzZVx1MDQzYVx1MDQzZVx1MDQzZFx1MDQ' +
    '0NFx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzZFx1MDQ0Nlx1MDQzOFx1MDQzOSIsImlkIjozLCJwZXJtaXNzaW9ucyI6WyJidWlsZGluZy5saXN0IiwiZGVwYXJ0bWVudC5saXN0IiwiZW1haWxfdGVtcGxhdGVzLmxpc3QiLCJldmVudC5saXN0IiwiZmlsZS5saXN0IiwibWVldGluZy5jcmVhdGUiLCJtZWV0aW5nLmRlbGV0ZSIsIm1lZXRpbmcubGlzdCIsIm1lZXRpbmcudXBkYXRlIiwibXVuaWNpcGFsX2FyZWEubGlzdCIsInJvbGUubGlzdCIsInJvbGUucGVybWlzc2lvbnNfbGlzdCIsInJvb20ubGlzdCIsInNldHRpbmcubGlzdCIsInVzZXIubGlzdCIsInN0YXRpc3RpY3MubGlzdCIsImZpbGUuY3JlYXRlIiwicGVybWFuZW50X3Jvb20ubGlzdCIsImdyb3VwLmxpc3QiLCJncm91cC5jcmVhdGUiLCJncm91cC51cGRhdGUiLCJncm91cC5kZWxldGUiLCJwZXJtYW5lbnRfcm9vbS5saXN0IiwidXNlci5jcmVhdGVfcHVibGljIiwidXNlci51cGRhdGVfcHVibGljIl19XX0sInRva2VuX2V4cGlyZWRfYXQiOjE3MzI5ODU1NDYuMCwidG9rZW5fY3JlYXRlZF9hdCI6MTczMjk3MTE0Ni4wLCJyZWZyZXNoX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SjFjMlZ5WDJsa0lqbzFOVE1zSW1WNGNDSTZNVGN6TXpVMU56Z3pOQzR3TENKMWNHUWlPakUzTXpJNU5EZzBOVGd1TUN3aWRIbHdJam9pY21WbWNtVnphQ0o5LmE3LWJaYzZ2XzJlTDYtUWNUQmZEbnVPRHhpQlBIdUI5VTF4bWFEX2Y2MWMifQ.2N-YMJ2dO-NyAO-zw_0DRhvh6FdWWqn-g0jwDs-wsKM')
const NameSearch = ref({})
const OldNameSearch = ref({})
const OrganizersSelect = ref({})
const DeportamentSelect = ref({})
const StatusSelect = ref([])
const NameItems = ref([])
const DeportamentItems = ref({})
const OrganizersItems = ref({})
const dates = ref()
const StatusItems = ref([
    { name: 'Забронировано', code: 'booked' },
    { name: 'Начата', code: 'started' },
    { name: 'Отменена', code: 'cancelled' },
    { name: 'Закончена', code: 'ended' },
])
nextTick(async () => {
    await GetDeportament();
})
const getFullName = (e) => ({ id: e.id, name: `${e.firstName} ${e.lastName} ${e.middleName}` })
function buildUrl(params) {
    const baseUrl = "https://test.vcc.uriit.ru/api/meetings?page=1&rowsNumber=0&rowsPerPage=101&showDeleted=false";
    const url = new URL(baseUrl);

    // Устанавливаем текущую дату, если fromDatetime не задан
    if (!params.fromDatetime) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Устанавливаем время на 00:00:00
        params.fromDatetime = today.toISOString().split('Z')[0];
    }

    // Устанавливаем toDatetime на 7 дней вперед, если он не задан
    if (!params.toDatetime) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7); // Добавляем 7 дней
        futureDate.setHours(0, 0, 0, 0); // Устанавливаем время на 00:00:00
        params.toDatetime = futureDate.toISOString().split('Z')[0];
    }

    // Определяем параметры, которые нужно добавить в URL
    const queryParams = [
        'page',
        'rowsNumber',
        'showDeleted',
        'sortBy',
        'filter',
        'state',
        'fromDatetime',
        'toDatetime',
        'priority',
        'buildingId',
        'roomId',
        'departmentId',
        'organizedBy',
        'backend'
    ];

    // Добавляем параметры в URL, если они переданы
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


async function search(e) {
   
    console.log(DeportamentItems.value)
    const url = buildUrl({
        filter: NameSearch.value,
        state: StatusSelect.value.map(e => e.code),
        department_id: DeportamentItems.value
    })
    const response = await fetch(url, {
        "headers": {
            "authorization": jwt.value
        },
    });
    const result = await response.json()
    NameItems.value = result.data
    await GetDeportament()

}

async function GetOrganizers() {
    const response = await fetch("https://test.vcc.uriit.ru/api/meetings/participants?page=1&rowsNumber=0&showDeleted=false&department_id=2", {
        "headers": {
            "authorization": jwt.value
        },
    });
    const result = await response.json()
    OrganizersItems.value = result
}
async function GetDeportament() {
    const response = await fetch("https://test.vcc.uriit.ru/api/catalogs/buildings?page=1&rowsNumber=0&showDeleted=false", {
        "headers": {
            "authorization": jwt.value
        },
    });
    const result = await response.json()
    DeportamentItems.value = result.data
}


</script>

<style>
#over_label {
    width: 100%;
}
#over_label1 {
    width: 100%;
}
</style>