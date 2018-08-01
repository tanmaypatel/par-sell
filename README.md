Implement a mini-system what allows storing information about Parcels, Tractors and Processed Parcels and generating additional reports.

If you are tested for the PHP, we prefer to use Yii2. If you are tested for NodeJS - use your favorite NodeJS framework.

Following features need to be implemented
1. Login form
2. Entering information about unlimited Parcels. Each Parcel has:
- Name
- Culture
- Area
3. Entering information about unlimited Tractors. Each Tractor is represented by: - Name
4. Storing information about Processing a Parcel. Process is as follows:
- Select a Tractor
- Select a Parcel
- Enter a date
- Enter area which should not exceed the area of the selected Parcel
- Save the information
5.Create a report for Processed Parcels. Report should include:
- Name of the Parcel
- Culture
- Date
- Name of the Tractor
- Processed Area
As summary the report should output the total amount of processed area.
6. The report should allow filtering/search by following parameters:
- Name of the Parcel
- Culture
- Date
- Name of the Tractor