const db = require("../db/index")
const Shipment = db.shipments
const Inventory = db.inventory;
const Orders = db.order;
const Report = db.reports

const { Sequelize, Op } = require('sequelize');
 
 
const shipmentReport = async (req, res) => {
 
    if (!req.user || req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Authenticate as Manager!' });
    }
 
    try {
        // Extract optional query parameters
        const { startDate, endDate, filterByStatus } = req.query;
 
        // Build the where clause based on optional parameters
        const whereClause = {
            ...(startDate && endDate && { shipment_date: { [Sequelize.Op.between]: [startDate, endDate] } }),
            ...(filterByStatus && { status: filterByStatus }),
        };
 
        // Query shipment details
        const shipmentDetails = await Shipment.findAll({
            where: whereClause,
            attributes: ['id', 'orderID', 'destination', 'shipment_date', 'expected_delivery', 'status', 'current_location'],
        });
 
 
 
 
        // Status analysis
        const statusAnalysis = await Shipment.count({
            where: whereClause,
            group: ['status'],
            attributes: ['status'],
        });
 
        // Delivery analysis
       
           
                const shipments = await Shipment.findAll({ where: whereClause });
       
                const analysisResult = shipments.reduce(
                    (result, shipment) => {
                        result.totalCount++;
                        const expectedDelivery = new Date(shipment.expected_delivery);
                        const shipmentDate = new Date(shipment.shipment_date);
       
                        // Calculate the difference in days between expected delivery and shipment date
                        const deliveryTimeDifference = Math.round((expectedDelivery - shipmentDate) / (1000 * 60 * 60 * 24));
       
                        // Check if the shipment is delayed
                        if (shipment.status === 'Delayed') {
                            result.delayedCount++;
                        }
       
                        result.totalDeliveryTime += deliveryTimeDifference;
       
                        return result;
                    },
                    {
                        totalCount: 0,
                        delayedCount: 0,
                        totalDeliveryTime: 0,
                    }
                );
       
                const averageDeliveryTime = analysisResult.totalDeliveryTime / analysisResult.totalCount;
                const delayedPercentage = (analysisResult.delayedCount / analysisResult.totalCount) * 100;
       
               
             const  deliveryAnalysis =  {
                    averageDeliveryTime,
                    delayedCount: analysisResult.delayedCount,
                    totalCount: analysisResult.totalCount,
                    delayedPercentage,
                };
             
       
 
 
 
 
        // Geographical distribution (assuming a 'region' column in the Shipment model)
        const geographicalDistribution = await Shipment.findAll({
            where: whereClause,
            group: ['destination'], // Change to the actual column name in your Shipment model
            attributes: ['destination', [Sequelize.fn('COUNT', '*'), 'shipmentsCount']],
        });
 
        // Example response (replace with actual data)
        const reportResponse = {
            shipmentDetails,
            statusAnalysis,
            deliveryAnalysis,
            geographicalDistribution,
        };
        const generated_date = new Date()
        await Report.create({userId:req.user.id,report_type:"Shipment",generated_date,report_data:reportResponse})
        res.json(reportResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
 
 
 
 
const inventoryReport = async (req, res) => {
    if (!req.user || req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Authenticate as Manager!' });
    }
 
    try {
        // Extract optional query parameters
        const { filterBy, sortBy, sortOrder } = req.query;
 
        // Define order and where clauses based on optional parameters
        const orderClause = sortBy ? [[sortBy, sortOrder || 'asc']] : [['id', 'asc']];
        const whereClause = filterBy
            ? {
                [Sequelize.Op.or]: [
                   
                    { supplier: { [Sequelize.Op.like]: `%${filterBy}%` } },
                ],
            }
            : {};
 
 
        //  inventory details
        const inventoryDetails = await Inventory.findAll({
            where: whereClause,
            order: orderClause,
            attributes: ['id', 'item_name', 'quantity', 'price', 'supplier'],
        });
 
 
 
        // Inventory levels analysis
        const totalItems = await Inventory.sum('quantity');
        const lowStockItems = await Inventory.count({ where: { quantity: { [Sequelize.Op.lt]: 10 } } });
        const outOfStockItems = await Inventory.count({ where: { quantity: 0 } });
 
 
 
        // Turnover Rate
        const turnoverRates = [];
 
        for (const item of inventoryDetails) {
            const itemOrder = await Orders.findOne({
                where: { item_code: item.id },
            });
 
 
 
            const quantitySold = itemOrder ? itemOrder.quantity : 0;
            const itemTurnover = item.price * quantitySold;
 
 
 
            turnoverRates.push({
                item_name: item.item_name,
                quantity_sold: quantitySold,
                turnover_rate: itemTurnover,
            });
        }
 
 
        const inventoryItems = await Inventory.findAll();
 
        // Calculate item cost (price * quantity) for each record
        const itemCosts = inventoryItems.map(item => {
            const quantity = item.get('quantity');
            const price = item.get('price');
            const itemCost = quantity * price;
 
            return {
                id: item.get('id'),
                item_name: item.get('item_name'),
                quantity,
                price,
                item_cost: itemCost,
            };
        });
 
        // Calculate the total cost by summing up the item costs
        const totalValue = itemCosts.reduce((sum, item) => sum + item.item_cost, 0);
        const averageCost = totalValue / totalItems;
 
 
 
        // Example response (replace with actual data)
        const reportOutcome = {
            inventoryDetails,
            inventorySummary: {
                totalItems,
                totalValue,
                averageCost,
                lowStockItems,
                outOfStockItems,
            },
            turnoverRates: turnoverRates,
            financialSummary: {
                totalValue,
                averageCost
            }
        };
        const generated_date = new Date()
        await Report.create({userId:req.user.id,report_type:"Inventory",generated_date,report_data:reportOutcome})
        res.status(200).json(reportOutcome);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
 
module.exports = {
    shipmentReport,
    inventoryReport
}