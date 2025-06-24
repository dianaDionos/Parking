export const formatPhoneNumber = (phoneNumber) => {
    // Format phone number to a standard format
    return phoneNumber.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

export const formatDate = (date) => {
    // Format date to a readable format
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

export const filterResidents = (residents, searchTerm) => {
    // Filter residents based on search term
    return residents.filter(resident => 
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.idNumber.includes(searchTerm)
    );
};

export const filterVisitors = (visitors, searchTerm) => {
    // Filter visitors based on search term
    return visitors.filter(visitor => 
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.idNumber.includes(searchTerm)
    );
};